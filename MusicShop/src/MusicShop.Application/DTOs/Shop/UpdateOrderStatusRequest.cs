using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public sealed record UpdateOrderStatusRequest(
    OrderStatus Status,
    string? TrackingNumber);
