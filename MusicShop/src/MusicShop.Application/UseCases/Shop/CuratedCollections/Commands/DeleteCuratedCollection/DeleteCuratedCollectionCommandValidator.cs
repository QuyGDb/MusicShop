using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.DeleteCuratedCollection;

public sealed class DeleteCuratedCollectionCommandValidator : AbstractValidator<DeleteCuratedCollectionCommand>
{
    public DeleteCuratedCollectionCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}
