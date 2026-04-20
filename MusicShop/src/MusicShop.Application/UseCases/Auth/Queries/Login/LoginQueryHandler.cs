using MediatR;
using MusicShop.Application.Common.Mappings;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Auth.Queries.Login;

public class LoginQueryHandler(
    IRepository<User> userRepository,
    IRepository<RefreshToken> refreshTokenRepository,
    IPasswordHasher passwordHasher,
    IRefreshTokenHasher refreshTokenHasher,
    ITokenService tokenService,
    IUnitOfWork unitOfWork) : IRequestHandler<LoginQuery, Result<AuthResponse>>
{

    // Handle the login logic
    public async Task<Result<AuthResponse>> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        // Check if the user exists
        User? existingUser = await userRepository.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (existingUser == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidCredentials);
        }

        // Verify the provided password
        if (existingUser.PasswordHash == null)
        {
            // User registered via external provider and hasn't set a local password
            return Result<AuthResponse>.Failure(AuthErrors.ExternalProviderOnly);
        }

        bool isPasswordValid = passwordHasher.Verify(request.Password, existingUser.PasswordHash);

        if (!isPasswordValid)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidCredentials);
        }

        // Generate access token and refresh token for this user
        (string accessToken, DateTime accessTokenExpiresAtUtc) = tokenService.GenerateAccessToken(existingUser);
        (string refreshToken, DateTime refreshTokenExpiresAtUtc) = tokenService.GenerateRefreshToken();

        refreshTokenRepository.Add(new RefreshToken
        {
            UserId = existingUser.Id,
            TokenHash = refreshTokenHasher.Hash(refreshToken),
            ExpiresAt = refreshTokenExpiresAtUtc
        });

        await unitOfWork.SaveChangesAsync(cancellationToken);

        // Return authentication response
        return Result<AuthResponse>.Success(existingUser.ToAuthResponse(accessToken, refreshToken, accessTokenExpiresAtUtc));
    }
}
