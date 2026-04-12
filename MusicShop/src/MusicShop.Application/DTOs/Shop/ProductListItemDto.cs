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
