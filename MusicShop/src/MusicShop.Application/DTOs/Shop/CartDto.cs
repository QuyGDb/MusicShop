namespace MusicShop.Application.DTOs.Shop;

public class CartDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public IEnumerable<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    public DateTime UpdatedAt { get; set; }
    
    public decimal Total => Items.Sum(x => x.Subtotal);
}

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
    public bool InStock { get; set; }
}
