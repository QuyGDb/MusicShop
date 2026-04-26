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
    
    public decimal Price { get; set; }
    public int StockQty { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsSigned { get; set; }
    
    public VinylAttributesDto? VinylAttributes { get; set; }
    public CdAttributesDto? CdAttributes { get; set; }
    public CassetteAttributesDto? CassetteAttributes { get; set; }
}
