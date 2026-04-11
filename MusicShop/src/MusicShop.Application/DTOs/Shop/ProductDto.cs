using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public class ProductListItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ArtistName { get; set; }
    public ReleaseFormat Format { get; set; }
    public bool IsLimited { get; set; }
    public bool IsPreorder { get; set; }
    public string? CoverUrl { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public bool InStock { get; set; }
    public double? AvgRating { get; set; }
    public int ReviewCount { get; set; }
}

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

public class ArtistShortDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string VariantName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQty { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsSigned { get; set; }
    
    // Attributes will be specialized based on format
    public object? Attributes { get; set; }
}
