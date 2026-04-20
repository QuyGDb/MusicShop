using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class AuthErrors
{
    public static readonly Error InvalidCredentials = new(
        "Auth.Unauthorized", 
        "Invalid email or password.",
        ErrorType.Unauthorized);

    public static readonly Error EmailAlreadyExists = new(
        "Auth.Conflict", 
        "The provided email is already in use.",
        ErrorType.Conflict);

    public static readonly Error InvalidRefreshToken = new(
        "Auth.InvalidToken", 
        "The refresh token is invalid or has expired.",
        ErrorType.Unauthorized);

    public static readonly Error UserNotFound = new(
        "User.NotFound", 
        "User not found.",
        ErrorType.NotFound);

    public static readonly Error Unauthorized = new(
        "Auth.Unauthorized",
        "User is not authenticated.",
        ErrorType.Unauthorized);

    public static readonly Error InvalidUserId = new(
        "Auth.InvalidUserId",
        "The user ID is invalid.",
        ErrorType.Validation);

    public static readonly Error InvalidToken = new(
        "Auth.InvalidToken",
        "The provided token is invalid.",
        ErrorType.Unauthorized);

    public static readonly Error GoogleInvalidToken = new(
        "Auth.GoogleInvalidToken",
        "Invalid Google ID Token or payload.",
        ErrorType.Unauthorized);

    public static readonly Error GoogleError = new(
        "Auth.GoogleError",
        "Error while verifying Google Token.",
        ErrorType.Failure);

    public static readonly Error ExternalProviderOnly = new(
        "Auth.ExternalProviderOnly",
        "This account is linked to Google. Please sign in with Google.",
        ErrorType.Unauthorized);
}
