namespace MusicShop.Application.DTOs.Shop;

public sealed record CuratedCollectionFeaturedResponse(
    Guid Id,
    string Title,
    string? Description,
    IReadOnlyList<CuratedCollectionFeaturedItemResponse> Items);

public sealed record CuratedCollectionFeaturedItemResponse(
    Guid ProductId,
    string Title,
    string ArtistName,
    decimal Price,
    string CoverUrl,
    int SortOrder);
