namespace MusicShop.Application.DTOs.Shop;

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string VariantName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQty { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsSigned { get; set; }
    
    // Attributes will be specialized based on format
    public object? Attributes { get; set; }
}
