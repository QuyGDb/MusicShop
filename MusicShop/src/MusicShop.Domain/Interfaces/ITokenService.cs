using MusicShop.Domain.Entities.System;

namespace MusicShop.Domain.Interfaces;

public interface ITokenService
{
    (string Token, DateTime ExpiresAtUtc) GenerateAccessToken(User user);
    (string Token, DateTime ExpiresAtUtc) GenerateRefreshToken();
    int RefreshTokenGracePeriodSeconds { get; }
}
