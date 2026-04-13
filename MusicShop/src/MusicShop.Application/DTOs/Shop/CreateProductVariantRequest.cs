namespace MusicShop.Application.DTOs.Shop;

public sealed record CreateProductVariantRequest(
    string VariantName,
    decimal Price,
    int StockQty,
    bool IsSigned,
    string? ImageUrl,
    VinylAttributesDto? VinylAttributes,
    CdAttributesDto? CdAttributes,
    CassetteAttributesDto? CassetteAttributes);
