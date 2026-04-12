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
            
            // Placeholder logic for review summaries (not yet implemented)
            AvgRating = 0, 
            ReviewCount = 0
        });
    }

    /// <summary>
    /// Projects Product entity to ProductDetailDto
    /// </summary>
    public static IQueryable<ProductDetailDto> ProjectToDetailDto(this IQueryable<Product> query)
    {
        return query.Select(p => new ProductDetailDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Format = p.Format,
            IsLimited = p.IsLimited,
            LimitedQty = p.LimitedQty,
            IsPreorder = p.IsPreorder,
            PreorderReleaseDate = p.PreorderReleaseDate,
            CoverUrl = p.CoverUrl,
            Artist = new ArtistShortDto
            {
                Id = p.ReleaseVersion != null && p.ReleaseVersion.Release != null ? p.ReleaseVersion.Release.ArtistId : Guid.Empty,
                Name = p.ReleaseVersion != null && p.ReleaseVersion.Release != null && p.ReleaseVersion.Release.Artist != null 
                    ? p.ReleaseVersion.Release.Artist.Name 
                    : string.Empty
            },
            Variants = p.Variants.Select(v => new ProductVariantDto
            {
                Id = v.Id,
                VariantName = v.VariantName,
                Price = v.Price,
                StockQty = v.StockQty,
                IsAvailable = v.IsAvailable,
                IsSigned = v.IsSigned
            }).ToList(), // EF Core handles collection projection
            AvgRating = 0,
            ReviewCount = 0
        });
    }
}
