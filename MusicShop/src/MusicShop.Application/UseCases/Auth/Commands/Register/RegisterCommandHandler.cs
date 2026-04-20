using MediatR;
using MusicShop.Application.Common.Mappings;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Auth.Commands.Register;

public class RegisterCommandHandler(
    IRepository<User> userRepository,
    IRepository<RefreshToken> refreshTokenRepository,
    IPasswordHasher passwordHasher,
    IRefreshTokenHasher refreshTokenHasher,
    ITokenService tokenService,
    IUnitOfWork unitOfWork) : IRequestHandler<RegisterCommand, Result<AuthResponse>>
{
    // Handle the registration logic
    public async Task<Result<AuthResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if the email is already registered
        User? existingUser = await userRepository.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (existingUser != null)
        {
            if (existingUser.PasswordHash == null)
            {
                return Result<AuthResponse>.Failure(AuthErrors.ExternalProviderOnly);
            }
            return Result<AuthResponse>.Failure(AuthErrors.EmailAlreadyExists);
        }

        // Hash the password for security
        string hashedPassword = passwordHasher.Hash(request.Password);

        // Create new User entity
        User newUser = new User
        {
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = hashedPassword,
            Role = Domain.Enums.UserRole.Customer
        };

        // Save user to change tracker
        userRepository.Add(newUser);

        // Generate access token and refresh token for this user
        (string accessToken, DateTime accessTokenExpiresAtUtc) = tokenService.GenerateAccessToken(newUser);
        (string refreshToken, DateTime refreshTokenExpiresAtUtc) = tokenService.GenerateRefreshToken();

        // Persist only the hash so leaked DB data cannot be used as a raw token
        refreshTokenRepository.Add(new RefreshToken
        {
            UserId = newUser.Id,
            TokenHash = refreshTokenHasher.Hash(refreshToken),
            ExpiresAt = refreshTokenExpiresAtUtc
        });

        await unitOfWork.SaveChangesAsync(cancellationToken);

        // Return the AuthResponse containing user info and token
        return Result<AuthResponse>.Success(newUser.ToAuthResponse(accessToken, refreshToken, accessTokenExpiresAtUtc));
    }
}
