namespace MusicShop.Application.DTOs.Catalog;

public class ReleaseVersionDto
{
    public Guid Id { get; set; }
    public string? PressingCountry { get; set; }
    public int? PressingYear { get; set; }
    public string Format { get; set; } = string.Empty;
    public string? CatalogNumber { get; set; }
    public string? Notes { get; set; }
    public string LabelName { get; set; } = string.Empty;

    // Shop Integration properties
    public decimal? Price { get; set; }
    public int? StockQty { get; set; }
    public string? ImageUrl { get; set; }
}
