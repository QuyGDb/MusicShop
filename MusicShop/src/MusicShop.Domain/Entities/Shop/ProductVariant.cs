using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class ProductVariant : BaseEntity
{
    public string VariantName { get; set; } = string.Empty; // "Black 180g Gatefold", etc.
    public decimal Price { get; set; }
    public int StockQty { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool IsSigned { get; set; } = false;

    // FK
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    // Extensions (1-1)
    // In EF Core, these are usually defined as navigation properties.
    // At runtime, only one will be populated based on the format of the Product.
    public VinylAttributes? VinylAttributes { get; set; }
    public CdAttributes? CdAttributes { get; set; }
    public CassetteAttributes? CassetteAttributes { get; set; }
}
