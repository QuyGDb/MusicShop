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
        Domain.Entities.Shop.CuratedCollection? curatedCollection = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (curatedCollection == null)
            return Result<Guid>.Failure(CuratedCollectionErrors.NotFound);

        if (request.Title != null)
            curatedCollection.Title = request.Title;

        if (request.Description != null)
            curatedCollection.Description = request.Description;

        if (request.IsPublished.HasValue)
            curatedCollection.IsPublished = request.IsPublished.Value;

        await repository.UpdateAsync(curatedCollection, cancellationToken);

        return Result<Guid>.Success(curatedCollection.Id);
    }
}
