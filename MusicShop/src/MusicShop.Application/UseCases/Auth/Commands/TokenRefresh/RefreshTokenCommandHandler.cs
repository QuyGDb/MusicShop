using MediatR;
using MusicShop.Application.Common.Mappings;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace MusicShop.Application.UseCases.Auth.Commands.TokenRefresh;

public class RefreshTokenCommandHandler(
    IRepository<User> userRepository,
    IRepository<RefreshToken> refreshTokenRepository,
    IRefreshTokenHasher refreshTokenHasher,
    ITokenService tokenService,
    IUnitOfWork unitOfWork) : IRequestHandler<RefreshTokenCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {

        // Basic input validation
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        // 1. Hash the incoming Refresh Token for comparison
        // We store only hashes in the DB for security, so we must hash the input to match
        string currentRefreshTokenHash = refreshTokenHasher.Hash(request.RefreshToken);

        // 2. Look up the token record in the database
        RefreshToken? existingRefreshToken = await refreshTokenRepository
            .FirstOrDefaultAsync(x => x.TokenHash == currentRefreshTokenHash, cancellationToken);

        // If no token is found => invalid or untracked token
        if (existingRefreshToken == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        // 3. Check if the token has already been revoked
        // A non-null RevokedAt value indicates the token was used or manually invalidated
        if (existingRefreshToken.RevokedAt != null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        // 4. Validate token expiration
        if (existingRefreshToken.ExpiresAt <= DateTime.UtcNow)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        // 5. Retrieve the user to issue new tokens
        User? user = await userRepository.GetByIdAsync(existingRefreshToken.UserId, cancellationToken);
        if (user == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.UserNotFound);
        }

        // 6. Generate a new set of Access and Refresh tokens
        (string accessToken, DateTime accessTokenExpiresAtUtc) = tokenService.GenerateAccessToken(user);
        (string newRefreshToken, DateTime newRefreshTokenExpiresAtUtc) = tokenService.GenerateRefreshToken();
        string newRefreshTokenHash = refreshTokenHasher.Hash(newRefreshToken);

        // 7. Perform Refresh Token Rotation
        existingRefreshToken.ReplacedByTokenHash = newRefreshTokenHash;
        existingRefreshToken.RevokedAt = DateTime.UtcNow;
        existingRefreshToken.UpdatedAt = DateTime.UtcNow;
        refreshTokenRepository.Update(existingRefreshToken);

        // 8. Save the new Refresh Token record
        refreshTokenRepository.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenHash,
            ExpiresAt = newRefreshTokenExpiresAtUtc
        });

        // 9. Persist all changes in a single atomic transaction
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // Return the fresh auth credentials to the client
        return Result<AuthResponse>.Success(user.ToAuthResponse(accessToken, newRefreshToken, accessTokenExpiresAtUtc));
    }
}
