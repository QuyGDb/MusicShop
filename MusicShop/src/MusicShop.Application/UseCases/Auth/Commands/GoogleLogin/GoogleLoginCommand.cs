using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Auth.Commands.GoogleLogin;

public record GoogleLoginCommand(string IdToken) : IRequest<Result<AuthResponse>>;
