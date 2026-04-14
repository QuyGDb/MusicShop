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
        Domain.Entities.Shop.CuratedCollection? curatedCollection = await repository.GetByIdWithItemsAsync(request.Id, cancellationToken);

        if (curatedCollection == null)
            return Result<CuratedCollectionDetailResponse>.Failure(CuratedCollectionErrors.NotFound);

        List<ProductListItemDto> productListItemDtos = curatedCollection.Items
            .Select(item => item.Product)
            .Select(product => new ProductListItemDto
            {
                Id = product.Id,
                Name = product.Name,
                ArtistName = product.ReleaseVersion.Release.Artist.Name,
                Format = product.Format,
                IsLimited = product.IsLimited,
                IsPreorder = product.IsPreorder,
                CoverUrl = product.ReleaseVersion.Release.CoverUrl,
                MinPrice = product.Variants.Count > 0 ? product.Variants.Min(variant => variant.Price) : 0,
                MaxPrice = product.Variants.Count > 0 ? product.Variants.Max(variant => variant.Price) : 0,
                InStock = product.Variants.Any(variant => variant.StockQty > 0 && variant.IsAvailable)
            })
            .ToList();

        return Result<CuratedCollectionDetailResponse>.Success(new CuratedCollectionDetailResponse(
            curatedCollection.Id,
            curatedCollection.Title,
            curatedCollection.Description,
            productListItemDtos));
    }
}
