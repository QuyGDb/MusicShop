using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.Common.Mappings;

public static class ProductMapping
{
    public static IQueryable<ProductListItemDto> ProjectToListItemDto(this IQueryable<Product> query)
    {
        return query.Select(p => new ProductListItemDto
        {
            Id = p.Id,
            Name = p.Name,
            ArtistName = p.ReleaseVersion != null && p.ReleaseVersion.Release != null && p.ReleaseVersion.Release.Artist != null 
                ? p.ReleaseVersion.Release.Artist.Name 
                : null,
            Format = p.Format,
            IsLimited = p.IsLimited,
            IsPreorder = p.IsPreorder,
            CoverUrl = p.CoverUrl,
            MinPrice = p.Variants.Any() ? p.Variants.Min(v => v.Price) : 0,
            MaxPrice = p.Variants.Any() ? p.Variants.Max(v => v.Price) : 0,
            InStock = p.Variants.Any(v => v.StockQty > 0 && v.IsAvailable),
            
            // Assuming we have reviews linked to Product entity
            // Using placeholder logic for now as we haven't implemented review summaries
            AvgRating = 0, 
            ReviewCount = 0
        });
    }
}
