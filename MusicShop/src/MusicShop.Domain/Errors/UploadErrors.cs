using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

/// <summary>
/// Domain errors for Upload operations
/// </summary>
public static class UploadErrors
{
    public static readonly Error EmptyFile = new(
        "Upload.EmptyFile",
        "The uploaded file is empty or missing.",
        ErrorType.Validation);

    public static readonly Error InvalidType = new(
        "Upload.InvalidType",
        "The uploaded file is not a valid image.",
        ErrorType.Validation);

    public static readonly Error InvalidFileName = new(
        "Upload.InvalidFileName",
        "The uploaded file has an invalid name.",
        ErrorType.Validation);
}
