namespace MusicShop.Application.DTOs.Shop;
public sealed record AddToCartRequest(Guid ProductId, int Quantity);