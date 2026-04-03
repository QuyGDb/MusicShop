using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Auth.Queries.Login;

public class LoginQueryHandler : IRequestHandler<LoginQuery, Result<AuthResponse>>
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    // Inject required dependencies
    public LoginQueryHandler(
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

    // Handle the login logic
    public async Task<Result<AuthResponse>> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        // Check if the user exists
        User? existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidCredentials);
        }

        // Verify the provided password
        bool isPasswordValid = _passwordHasher.Verify(request.Password, existingUser.PasswordHash);

        if (!isPasswordValid)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidCredentials);
        }

        // Generate access token and refresh token for this user
        (string accessToken, DateTime accessTokenExpiresAtUtc) = _tokenService.GenerateAccessToken(existingUser);
        (string refreshToken, DateTime refreshTokenExpiresAtUtc) = _tokenService.GenerateRefreshToken();

        _refreshTokenRepository.Add(new RefreshToken
        {
            UserId = existingUser.Id,
            TokenHash = _refreshTokenHasher.Hash(refreshToken),
            ExpiresAt = refreshTokenExpiresAtUtc
        });

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Return authentication response
        return Result<AuthResponse>.Success(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt = accessTokenExpiresAtUtc,
            UserId = existingUser.Id,
            Email = existingUser.Email,
            FullName = existingUser.FullName,
            Role = existingUser.Role.ToString()
        });
    }
}
