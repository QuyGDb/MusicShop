using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class ReleaseVersionErrors
{
    public static readonly Error NotFound = new(
        "ReleaseVersion.NotFound", 
        "The specified release version was not found.",
        ErrorType.NotFound);
}
