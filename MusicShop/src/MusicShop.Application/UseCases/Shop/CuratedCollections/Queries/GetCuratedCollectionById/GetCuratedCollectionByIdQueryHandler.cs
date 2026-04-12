using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollectionById;

public sealed class GetCuratedCollectionByIdQueryHandler(
    ICuratedCollectionRepository repository) : IRequestHandler<GetCuratedCollectionByIdQuery, Result<CuratedCollectionDetailResponse>>
{
    public async Task<Result<CuratedCollectionDetailResponse>> Handle(GetCuratedCollectionByIdQuery request, CancellationToken cancellationToken)
    {
        var collection = await repository.GetByIdWithItemsAsync(request.Id, cancellationToken);

        if (collection == null)
            return Result<CuratedCollectionDetailResponse>.Failure(new Error("CuratedCollection.NotFound", "Collection not found."));

        var products = collection.Items
            .Select(i => i.Product)
            .Select(p => new ProductListItemDto
            {
                Id = p.Id,
                Name = p.Name,
                ArtistName = p.ReleaseVersion.Release.Artist.Name,
                Format = p.Format,
                IsLimited = p.IsLimited,
                IsPreorder = p.IsPreorder,
                CoverUrl = p.ReleaseVersion.Release.CoverUrl,
                MinPrice = p.Variants.Any() ? p.Variants.Min(v => v.Price) : 0,
                MaxPrice = p.Variants.Any() ? p.Variants.Max(v => v.Price) : 0,
                InStock = p.Variants.Any(v => v.StockQty > 0 && v.IsAvailable)
            })
            .ToList();

        return Result<CuratedCollectionDetailResponse>.Success(new CuratedCollectionDetailResponse(
            collection.Id,
            collection.Title,
            collection.Description,
            products));
    }
}
