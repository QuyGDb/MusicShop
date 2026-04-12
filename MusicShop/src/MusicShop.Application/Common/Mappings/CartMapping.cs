using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Entities.Orders;

namespace MusicShop.Application.Common.Mappings;

/// <summary>
/// Manual mapping helper for Cart entities
/// </summary>
public static class CartMapping
{
    /// <summary>
    /// Projects a Cart entity to a CartDto
    /// </summary>
    public static CartDto ToDto(this Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            UpdatedAt = cart.UpdatedAt,
            Items = cart.Items.Select(i => new CartItemDto
            {
                Id = i.Id,
                VariantId = i.VariantId,
                Quantity = i.Quantity,
                ProductName = i.Variant?.Product?.Name ?? "Unknown Product",
                VariantName = i.Variant?.VariantName ?? "Standard",
                CoverUrl = i.Variant?.Product?.CoverUrl,
                UnitPrice = i.Variant?.Price ?? 0,
                InStock = (i.Variant?.StockQty ?? 0) >= i.Quantity
            }).ToList()
        };
    }
}
