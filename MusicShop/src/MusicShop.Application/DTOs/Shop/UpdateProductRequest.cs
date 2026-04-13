namespace MusicShop.Application.DTOs.Shop;

public sealed record UpdateProductRequest(
    string? Name,
    string? Slug,
    string? Description,
    bool? IsActive,
    bool? IsPreorder,
    DateTime? PreorderReleaseDate,
    int? LimitedQty);
