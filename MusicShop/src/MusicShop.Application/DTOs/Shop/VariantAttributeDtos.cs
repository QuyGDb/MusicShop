namespace MusicShop.Application.DTOs.Shop;

public sealed record VinylAttributesDto(
    string? DiscColor,
    int? WeightGrams,
    int? SpeedRpm,
    string? DiscCount,
    string? SleeveType);

public sealed record CdAttributesDto(
    string? Edition,
    bool IsJapanEdition);

public sealed record CassetteAttributesDto(
    string? TapeColor,
    string? Edition);
