using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Auth.Commands.TokenRefresh;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<Result<AuthResponse>>;
