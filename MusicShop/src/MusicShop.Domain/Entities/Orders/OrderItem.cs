using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Domain.Entities.Orders;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }
    public decimal PriceSnapshot { get; set; }
    public string ProductNameSnapshot { get; set; } = string.Empty;
}
