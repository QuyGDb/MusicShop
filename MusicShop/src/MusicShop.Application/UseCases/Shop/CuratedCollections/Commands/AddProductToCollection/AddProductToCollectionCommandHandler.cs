using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.AddProductToCollection;

public sealed class AddProductToCollectionCommandHandler(
    ICuratedCollectionRepository repository,
    IProductRepository productRepository)
    : IRequestHandler<AddProductToCollectionCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(AddProductToCollectionCommand request, CancellationToken cancellationToken)
    {
        if (!await repository.ExistsAsync(request.CollectionId, cancellationToken))
            return Result<Guid>.Failure(CuratedCollectionErrors.NotFound);

        if (!await productRepository.AnyAsync(product => product.Id == request.ProductId, cancellationToken))
            return Result<Guid>.Failure(CuratedCollectionErrors.ProductNotFound);

        if (await repository.ItemExistsAsync(request.CollectionId, request.ProductId, cancellationToken) )
            return Result<Guid>.Failure(CuratedCollectionErrors.AlreadyInCollection);

        int sortOrder = request.SortOrder ?? await repository.GetNextSortOrderAsync(request.CollectionId, cancellationToken);

        CuratedCollectionItem curatedCollectionItem = new CuratedCollectionItem
        {
            CollectionId = request.CollectionId,
            ProductId = request.ProductId,
            SortOrder = sortOrder
        };

        await repository.AddItemAsync(curatedCollectionItem, cancellationToken);

        return Result<Guid>.Success(curatedCollectionItem.Id);
    }
}
