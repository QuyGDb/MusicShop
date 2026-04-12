using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.RemoveProductFromCollection;

public sealed class RemoveProductFromCollectionCommandHandler(ICuratedCollectionRepository repository)
    : IRequestHandler<RemoveProductFromCollectionCommand, Result<Unit>>
{
    public async Task<Result<Unit>> Handle(RemoveProductFromCollectionCommand request, CancellationToken cancellationToken)
    {
        if (!await repository.ExistsAsync(request.CollectionId, cancellationToken))
            return Result<Unit>.Failure(CuratedCollectionErrors.NotFound);

        if (!await repository.ItemExistsAsync(request.CollectionId, request.ProductId, cancellationToken))
            return Result<Unit>.Failure(CuratedCollectionErrors.ProductNotFound);

        await repository.RemoveItemAsync(request.CollectionId, request.ProductId, cancellationToken);

        return Result<Unit>.Success(Unit.Value);
    }
}
