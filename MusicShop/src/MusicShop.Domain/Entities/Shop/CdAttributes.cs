using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class CdAttributes : BaseEntity
{
    public Guid ProductVariantId { get; set; }
    public ProductVariant ProductVariant { get; set; } = null!;

    public string? Edition { get; set; } // Standard, Deluxe, etc.
    public bool IsJapanEdition { get; set; } = false;
}
