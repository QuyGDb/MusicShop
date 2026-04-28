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
            Slug = p.Slug,
            ArtistName = p.ReleaseVersion != null && p.ReleaseVersion.Release != null && p.ReleaseVersion.Release.Artist != null 
                ? p.ReleaseVersion.Release.Artist.Name 
                : null,
            Format = p.ReleaseVersion != null ? p.ReleaseVersion.Format : ReleaseFormat.Vinyl,
            IsLimited = p.IsLimited,
            IsPreorder = p.IsPreorder,
            CoverUrl = p.CoverUrl,
            Price = p.Price,
            StockQty = p.StockQty,
            InStock = p.StockQty > 0 && p.IsAvailable
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
            Format = p.ReleaseVersion != null ? p.ReleaseVersion.Format : ReleaseFormat.Vinyl,
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
            Price = p.Price,
            StockQty = p.StockQty,
            IsAvailable = p.IsAvailable,
            IsSigned = p.IsSigned,
            VinylAttributes = p.VinylAttributes != null ? new VinylAttributesDto(
                p.VinylAttributes.DiscColor,
                p.VinylAttributes.WeightGrams,
                p.VinylAttributes.SpeedRpm,
                p.VinylAttributes.DiscCount,
                p.VinylAttributes.SleeveType) : null,
            CdAttributes = p.CdAttributes != null ? new CdAttributesDto(
                p.CdAttributes.Edition,
                p.CdAttributes.IsJapanEdition) : null,
            CassetteAttributes = p.CassetteAttributes != null ? new CassetteAttributesDto(
                p.CassetteAttributes.TapeColor,
                p.CassetteAttributes.Edition) : null
        });
    }
}
