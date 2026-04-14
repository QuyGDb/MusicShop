using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollections;

public sealed class GetCuratedCollectionsQueryHandler(
    ICuratedCollectionRepository repository) : IRequestHandler<GetCuratedCollectionsQuery, Result<IReadOnlyList<CuratedCollectionResponse>>>
{
    public async Task<Result<IReadOnlyList<CuratedCollectionResponse>>> Handle(GetCuratedCollectionsQuery request, CancellationToken cancellationToken)
    {
        IReadOnlyList<Domain.Entities.Shop.CuratedCollection> curatedCollections = await repository.GetPublishedAsync(cancellationToken);

        List<CuratedCollectionResponse> curatedCollectionResponses = curatedCollections.Select(curatedCollection => new CuratedCollectionResponse(
            curatedCollection.Id,
            curatedCollection.Title,
            curatedCollection.Description))
            .ToList();

        return Result<IReadOnlyList<CuratedCollectionResponse>>.Success(curatedCollectionResponses);
    }
}
