using MusicShop.Domain.Entities.System;

namespace MusicShop.Domain.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
