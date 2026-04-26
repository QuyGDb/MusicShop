using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class CassetteAttributes : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string? TapeColor { get; set; }
    public string? Edition { get; set; } // Standard, Limited, etc.
}
