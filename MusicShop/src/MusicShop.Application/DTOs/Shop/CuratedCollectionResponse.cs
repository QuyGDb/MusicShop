namespace MusicShop.Application.DTOs.Shop;

public sealed record CuratedCollectionResponse(
    Guid Id,
    string Title,
    string? Description,
    string? CoverUrl);
