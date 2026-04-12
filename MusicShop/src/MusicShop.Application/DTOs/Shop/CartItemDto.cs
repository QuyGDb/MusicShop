namespace MusicShop.Application.DTOs.Shop;

public class CartItemDto
{
    public Guid Id { get; set; }
    public Guid VariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string VariantName { get; set; } = string.Empty;
    public string? CoverUrl { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => UnitPrice * Quantity;
    public decimal TotalPrice => UnitPrice * Quantity;
    public bool InStock { get; set; }
}
