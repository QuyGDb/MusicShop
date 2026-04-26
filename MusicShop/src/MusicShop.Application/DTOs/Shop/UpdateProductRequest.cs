namespace MusicShop.Application.DTOs.Shop;

public sealed record UpdateProductRequest(
    string? Name,
    string? Slug,
    string? Description,
    bool? IsActive,
    bool? IsPreorder,
    DateTime? PreorderReleaseDate,
    int? LimitedQty,
    decimal? Price,
    int? StockQty,
    bool? IsSigned,
    VinylAttributesDto? VinylAttributes = null,
    CdAttributesDto? CdAttributes = null,
    CassetteAttributesDto? CassetteAttributes = null);
