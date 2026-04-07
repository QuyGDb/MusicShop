using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class CassetteAttributes : BaseEntity
{
    public Guid ProductVariantId { get; set; }
    public ProductVariant ProductVariant { get; set; } = null!;

    public string? TapeColor { get; set; }
    public string? Edition { get; set; } // Standard, Limited, etc.
}
