using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Auth.Commands.TokenRefresh;

public class RefreshTokenCommand : IRequest<Result<AuthResponse>>
{
    public string RefreshToken { get; set; } = string.Empty;
}
