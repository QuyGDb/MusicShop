using MediatR;
using MusicShop.Application.DTOs.Auth;

namespace MusicShop.Application.UseCases.Auth.Queries.Login;

public class LoginQuery : IRequest<AuthResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
