namespace MusicShop.Application.DTOs.Catalog;

public sealed record UpdateArtistRequest(
    string Name,
    string Slug,
    string? Bio,
    string? Country,
    string? ImageUrl,
    List<Guid>? GenreIds = null);
