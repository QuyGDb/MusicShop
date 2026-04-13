namespace MusicShop.Application.DTOs.Shop;
public sealed record AddToCartRequest(Guid ProductVariantId, int Quantity);