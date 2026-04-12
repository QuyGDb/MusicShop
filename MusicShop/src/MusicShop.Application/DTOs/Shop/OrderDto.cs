using System.Collections.Generic;
using System.Linq;

namespace MusicShop.Application.DTOs.Shop;

/// <summary>
/// Data transfer object for order information
/// </summary>
public sealed class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public ICollection<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();

    // Customer info
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
}
