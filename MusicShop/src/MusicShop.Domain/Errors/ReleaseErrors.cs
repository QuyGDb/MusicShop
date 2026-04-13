using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class ReleaseErrors
{
    public static readonly Error NotFound = new(
        "Release.NotFound", 
        "The specified release was not found.",
        ErrorType.NotFound);

    public static readonly Error ArtistNotFound = new(
        "Artist.NotFound", 
        "The associated artist was not found.",
        ErrorType.NotFound);

    public static readonly Error HasVersions = new(
        "Release.HasVersions", 
        "Cannot delete release with existing pressing versions.",
        ErrorType.Conflict);

    public static readonly Error DuplicateSlug = new(
        "Release.DuplicateSlug",
        "The specified slug is already in use by another release.",
        ErrorType.Conflict);
}
