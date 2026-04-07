using FluentValidation;

namespace MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.CreateReleaseVersion;

public class CreateReleaseVersionCommandValidator : AbstractValidator<CreateReleaseVersionCommand>
{
    public CreateReleaseVersionCommandValidator()
    {
        RuleFor(x => x.ReleaseId).NotEmpty();
        RuleFor(x => x.LabelId).NotEmpty();
        RuleFor(x => x.Format).IsInEnum();
        RuleFor(x => x.PressingYear)
            .InclusiveBetween(1900, 2100)
            .When(x => x.PressingYear.HasValue);
    }
}
