namespace MusicShop.Application.DTOs.Shop;
public sealed record AddProductToCollectionRequest(Guid ProductId, int? SortOrder);
