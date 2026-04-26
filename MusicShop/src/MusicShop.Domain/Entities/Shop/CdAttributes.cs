using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class CdAttributes : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string? Edition { get; set; } // Standard, Deluxe, etc.
    public bool IsJapanEdition { get; set; } = false;
}
