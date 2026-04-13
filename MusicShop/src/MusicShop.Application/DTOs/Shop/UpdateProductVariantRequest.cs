namespace MusicShop.Application.DTOs.Shop;

public sealed record UpdateProductVariantRequest(
    string VariantName,
    decimal Price,
    int StockQty,
    bool IsSigned,
    bool IsAvailable,
    VinylAttributesDto? VinylAttributes,
    CdAttributesDto? CdAttributes,
    CassetteAttributesDto? CassetteAttributes);
