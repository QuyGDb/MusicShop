using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.UpdateCuratedCollection;

public sealed class UpdateCuratedCollectionCommandHandler(ICuratedCollectionRepository repository)
    : IRequestHandler<UpdateCuratedCollectionCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(UpdateCuratedCollectionCommand request, CancellationToken cancellationToken)
    {
        var collection = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (collection == null)
            return Result<Guid>.Failure(CuratedCollectionErrors.NotFound);

        if (request.Title != null)
            collection.Title = request.Title;

        if (request.Description != null)
            collection.Description = request.Description;

        if (request.IsPublished.HasValue)
            collection.IsPublished = request.IsPublished.Value;

        await repository.UpdateAsync(collection, cancellationToken);

        return Result<Guid>.Success(collection.Id);
    }
}
