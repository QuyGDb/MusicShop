using FluentValidation;

namespace MusicShop.Application.UseCases.Auth.Commands.TokenRefresh;

public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
    }
}
