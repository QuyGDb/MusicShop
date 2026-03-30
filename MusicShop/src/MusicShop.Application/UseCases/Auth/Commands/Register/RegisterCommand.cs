using MediatR;
using MusicShop.Application.DTOs.Auth;

namespace MusicShop.Application.UseCases.Auth.Commands.Register;

public class RegisterCommand : IRequest<AuthResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}
