using FluentValidation;

namespace MusicShop.Application.UseCases.Catalog.Releases.Commands.CreateRelease;

public sealed class CreateReleaseCommandValidator : AbstractValidator<CreateReleaseCommand>
{
    public CreateReleaseCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Year).GreaterThan(1900);
        RuleFor(x => x.ArtistId).NotEmpty();
    }
}
