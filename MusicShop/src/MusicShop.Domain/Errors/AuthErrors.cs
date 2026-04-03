using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class AuthErrors
{
    public static readonly Error InvalidCredentials = new(
        "Auth.InvalidCredentials", 
        "Invalid email or password.");

    public static readonly Error EmailAlreadyExists = new(        "Auth.EmailAlreadyExists", 
        "The provided email is already in use.");

    public static readonly Error InvalidRefreshToken = new(
        "Auth.InvalidRefreshToken", 
        "The refresh token is invalid or has expired.");

    public static readonly Error UserNotFound = new(
        "Auth.UserNotFound", 
        "User not found.");
}
