using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class VinylAttributes : BaseEntity
{
    public Guid ProductVariantId { get; set; }
    public ProductVariant ProductVariant { get; set; } = null!;

    public string? DiscColor { get; set; } // enum in DB, but string in simple C# if not using specific enums
    public int? WeightGrams { get; set; }
    public int? SpeedRpm { get; set; }
    public string? DiscCount { get; set; } // 1LP, 2LP, etc.
    public string? SleeveType { get; set; }
}
