using FluentValidation;

namespace MusicShop.Application.UseCases.Catalog.Releases.Commands.UpdateRelease;

public sealed class UpdateReleaseCommandValidator : AbstractValidator<UpdateReleaseCommand>
{
    public UpdateReleaseCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.Slug)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.Year)
            .InclusiveBetween(1800, 2100);

        RuleFor(x => x.ArtistId)
            .NotEmpty();

        RuleForEach(x => x.Tracks).ChildRules(track =>
        {
            track.RuleFor(t => t.Title)
                .NotEmpty()
                .MaximumLength(300);

            track.RuleFor(t => t.Position)
                .GreaterThan(0);

            track.RuleFor(t => t.DurationSeconds)
                .GreaterThanOrEqualTo(0)
                .When(t => t.DurationSeconds.HasValue);
        });
    }
}
