namespace MusicShop.Application.DTOs.Shop;
public sealed record UpdateCuratedCollectionRequest(string? Title, string? Description, bool? IsPublished);
