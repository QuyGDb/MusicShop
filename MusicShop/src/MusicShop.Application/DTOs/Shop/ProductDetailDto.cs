using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public class ProductDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ReleaseFormat Format { get; set; }
    public bool IsLimited { get; set; }
    public int? LimitedQty { get; set; }
    public bool IsPreorder { get; set; }
    public DateTime? PreorderReleaseDate { get; set; }
    public string? CoverUrl { get; set; }
    
    public ArtistShortDto Artist { get; set; } = null!;
    public IEnumerable<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
    
    public double? AvgRating { get; set; }
    public int ReviewCount { get; set; }
}
