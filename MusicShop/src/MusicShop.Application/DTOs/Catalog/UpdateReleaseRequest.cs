namespace MusicShop.Application.DTOs.Catalog;

public sealed record UpdateReleaseRequest(
    string Title,
    string Slug,
    int Year,
    Guid ArtistId,
    string? CoverUrl,
    string? Description,
    List<Guid>? GenreIds,
    List<TrackCreateDto>? Tracks);
