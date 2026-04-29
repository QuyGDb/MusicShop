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
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        string currentRefreshTokenHash = refreshTokenHasher.Hash(request.RefreshToken);

        RefreshToken? existingRefreshToken = await refreshTokenRepository
            .FirstOrDefaultAsync(x => x.TokenHash == currentRefreshTokenHash, cancellationToken);

        if (existingRefreshToken == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        // Allow a grace period for rotated tokens to handle concurrent requests
        if (existingRefreshToken.RevokedAt != null && 
            existingRefreshToken.RevokedAt.Value.AddSeconds(tokenService.RefreshTokenGracePeriodSeconds) < DateTime.UtcNow)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        if (existingRefreshToken.ExpiresAt <= DateTime.UtcNow)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        User? user = await userRepository.GetByIdAsync(existingRefreshToken.UserId, cancellationToken);
        if (user == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.UserNotFound);
        }

        (string accessToken, DateTime accessTokenExpiresAtUtc) = tokenService.GenerateAccessToken(user);
        (string newRefreshToken, DateTime newRefreshTokenExpiresAtUtc) = tokenService.GenerateRefreshToken();
        string newRefreshTokenHash = refreshTokenHasher.Hash(newRefreshToken);

        existingRefreshToken.ReplacedByTokenHash = newRefreshTokenHash;
        existingRefreshToken.RevokedAt = DateTime.UtcNow;
        existingRefreshToken.UpdatedAt = DateTime.UtcNow;
        refreshTokenRepository.Update(existingRefreshToken);

        refreshTokenRepository.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenHash,
            ExpiresAt = newRefreshTokenExpiresAtUtc
        });

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<AuthResponse>.Success(user.ToAuthResponse(accessToken, newRefreshToken, accessTokenExpiresAtUtc));
    }
}
