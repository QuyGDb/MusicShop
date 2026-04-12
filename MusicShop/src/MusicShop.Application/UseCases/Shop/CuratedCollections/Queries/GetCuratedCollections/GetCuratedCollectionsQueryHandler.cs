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
        var collections = await repository.GetPublishedAsync(cancellationToken);

        var response = collections.Select(c => new CuratedCollectionResponse(
            c.Id,
            c.Title,
            c.Description,
            c.CoverUrl))
            .ToList();

        return Result<IReadOnlyList<CuratedCollectionResponse>>.Success(response);
    }
}
