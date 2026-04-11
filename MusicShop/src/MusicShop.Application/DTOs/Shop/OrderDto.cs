using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public class OrderDto
{
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? TrackingNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
}

public class OrderItemDto
{
    public Guid Id { get; set; }
    public Guid VariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string VariantName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => UnitPrice * Quantity;
}
