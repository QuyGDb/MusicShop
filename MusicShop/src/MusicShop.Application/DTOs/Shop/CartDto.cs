using System.Collections.Generic;
using System.Linq;

namespace MusicShop.Application.DTOs.Shop;

/// <summary>
/// Data transfer object for the shopping cart
/// </summary>
public sealed class CartDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public ICollection<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    public DateTime UpdatedAt { get; set; }

    // Computed properties
    public decimal TotalAmount => Items.Sum(i => i.TotalPrice);
    public int TotalItems => Items.Sum(i => i.Quantity);
}
