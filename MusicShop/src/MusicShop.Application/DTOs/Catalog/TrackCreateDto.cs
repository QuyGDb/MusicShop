namespace MusicShop.Application.DTOs.Catalog;

public record TrackCreateDto(
    int Position,
    string Title,
    int? DurationSeconds,
    string? Side);
