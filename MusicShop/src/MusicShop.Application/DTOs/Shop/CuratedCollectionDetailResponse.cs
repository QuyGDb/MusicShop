namespace MusicShop.Application.DTOs.Shop;

public sealed record CuratedCollectionDetailResponse(
    Guid Id,
    string Title,
    string? Description,
    IReadOnlyList<ProductListItemDto> Products);
