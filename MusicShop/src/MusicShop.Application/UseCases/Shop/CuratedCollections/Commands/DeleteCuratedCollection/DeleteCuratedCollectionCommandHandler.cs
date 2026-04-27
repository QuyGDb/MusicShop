using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.DeleteCuratedCollection;

public sealed class DeleteCuratedCollectionCommandHandler(ICuratedCollectionRepository repository)
    : IRequestHandler<DeleteCuratedCollectionCommand, Result<Unit>>
{
    public async Task<Result<Unit>> Handle(DeleteCuratedCollectionCommand request, CancellationToken cancellationToken)
    {
        var collection = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (collection == null)
            return Result<Unit>.Failure(CuratedCollectionErrors.NotFound);

        await repository.DeleteAsync(collection, cancellationToken);

        return Result<Unit>.Success(Unit.Value);
    }
}
