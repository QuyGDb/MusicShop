using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.RemoveProductFromCollection;

public sealed class RemoveProductFromCollectionCommandValidator : AbstractValidator<RemoveProductFromCollectionCommand>
{
    public RemoveProductFromCollectionCommandValidator()
    {
        RuleFor(x => x.CollectionId).NotEmpty();
        RuleFor(x => x.ProductId).NotEmpty();
    }
}
