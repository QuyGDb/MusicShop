using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.UpdateCuratedCollection;

public sealed class UpdateCuratedCollectionCommandValidator : AbstractValidator<UpdateCuratedCollectionCommand>
{
    public UpdateCuratedCollectionCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.Title)
            .NotEmpty().When(x => x.Title != null)
            .MaximumLength(200).When(x => x.Title != null);

        RuleFor(x => x.Description)
            .MaximumLength(1000).When(x => x.Description != null);
    }
}
