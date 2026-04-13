namespace MusicShop.Application.DTOs.Catalog;

public sealed record UpdateLabelRequest(
    string Name,
    string Slug,
    string? Country,
    int? FoundedYear,
    string? Website);
