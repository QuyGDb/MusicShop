namespace MusicShop.Application.DTOs.Catalog;

public record TrackCreateDto(
    Guid? Id,
    int Position,
    string Title,
    int? DurationSeconds,
    string? Side);
