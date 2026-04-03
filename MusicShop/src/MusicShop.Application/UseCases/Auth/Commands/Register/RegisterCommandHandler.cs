using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthResponse>>
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    // Inject required dependencies
    public RegisterCommandHandler(
        IRepository<User> userRepository,
        IRepository<RefreshToken> refreshTokenRepository,
        IPasswordHasher passwordHasher,
        IRefreshTokenHasher refreshTokenHasher,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordHasher = passwordHasher;
        _refreshTokenHasher = refreshTokenHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    // Handle the registration logic
    public async Task<Result<AuthResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if the email is already registered
        User? existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.EmailAlreadyExists);
        }

        // Hash the password for security
        string hashedPassword = _passwordHasher.Hash(request.Password);

        // Create new User entity
        User newUser = new User
        {
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = hashedPassword,
            Role = Domain.Enums.UserRole.Customer
        };

        // Save user to change tracker
        _userRepository.Add(newUser);

        // Generate access token and refresh token for this user
        (string accessToken, DateTime accessTokenExpiresAtUtc) = _tokenService.GenerateAccessToken(newUser);
        (string refreshToken, DateTime refreshTokenExpiresAtUtc) = _tokenService.GenerateRefreshToken();

        // Persist only the hash so leaked DB data cannot be used as a raw token
        _refreshTokenRepository.Add(new RefreshToken
        {
            UserId = newUser.Id,
            TokenHash = _refreshTokenHasher.Hash(refreshToken),
            ExpiresAt = refreshTokenExpiresAtUtc
        });

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Return the AuthResponse containing user info and token
        return Result<AuthResponse>.Success(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt = accessTokenExpiresAtUtc,
            UserId = newUser.Id,
            Email = newUser.Email,
            FullName = newUser.FullName,
            Role = newUser.Role.ToString()
        });
    }
}
