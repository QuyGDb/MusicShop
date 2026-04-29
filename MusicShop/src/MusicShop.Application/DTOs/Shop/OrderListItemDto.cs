using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public sealed record OrderListItemDto(
    Guid Id,
    OrderStatus Status,
    decimal TotalAmount,
    DateTime CreatedAt,
    int ItemCount,
    string RecipientName,
    string Email);
