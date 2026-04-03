using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Auth.Commands.TokenRefresh;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<AuthResponse>>
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenCommandHandler(
        IRepository<User> userRepository,
        IRepository<RefreshToken> refreshTokenRepository,
        IRefreshTokenHasher refreshTokenHasher,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _refreshTokenHasher = refreshTokenHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AuthResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        string currentRefreshTokenHash = _refreshTokenHasher.Hash(request.RefreshToken);

        RefreshToken? existingRefreshToken = await _refreshTokenRepository
            .FirstOrDefaultAsync(x => x.TokenHash == currentRefreshTokenHash);

        if (existingRefreshToken == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        if (existingRefreshToken.RevokedAt != null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        if (existingRefreshToken.ExpiresAt <= DateTime.UtcNow)
        {
            return Result<AuthResponse>.Failure(AuthErrors.InvalidRefreshToken);
        }

        User? user = await _userRepository.GetByIdAsync(existingRefreshToken.UserId);
        if (user == null)
        {
            return Result<AuthResponse>.Failure(AuthErrors.UserNotFound);
        }

        (string accessToken, DateTime accessTokenExpiresAtUtc) = _tokenService.GenerateAccessToken(user);
        (string newRefreshToken, DateTime newRefreshTokenExpiresAtUtc) = _tokenService.GenerateRefreshToken();
        string newRefreshTokenHash = _refreshTokenHasher.Hash(newRefreshToken);

        existingRefreshToken.RevokedAt = DateTime.UtcNow;
        existingRefreshToken.ReplacedByTokenHash = newRefreshTokenHash;
        existingRefreshToken.UpdatedAt = DateTime.UtcNow;
        _refreshTokenRepository.Update(existingRefreshToken);

        _refreshTokenRepository.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenHash,
            ExpiresAt = newRefreshTokenExpiresAtUtc
        });

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<AuthResponse>.Success(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            AccessTokenExpiresAt = accessTokenExpiresAtUtc,
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString()
        });
    }
}
