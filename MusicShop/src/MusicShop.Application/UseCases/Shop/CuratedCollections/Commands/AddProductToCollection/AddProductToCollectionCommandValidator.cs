using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.AddProductToCollection;

public sealed class AddProductToCollectionCommandValidator : AbstractValidator<AddProductToCollectionCommand>
{
    public AddProductToCollectionCommandValidator()
    {
        RuleFor(x => x.CollectionId).NotEmpty();
        RuleFor(x => x.ProductId).NotEmpty();
    }
}
