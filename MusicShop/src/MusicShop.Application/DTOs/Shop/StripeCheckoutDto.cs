namespace MusicShop.Application.DTOs.Shop;

public sealed record StripeCheckoutDto(
    string SessionId,
    string Url);
