using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public sealed record CreateOrderResponse(
    OrderSummaryDto Order,
    PaymentSummaryDto? Payment);

public sealed record OrderSummaryDto(
    Guid Id,
    OrderStatus Status,
    decimal TotalAmount,
    DateTime CreatedAt);

public sealed record PaymentSummaryDto(
    Guid Id,
    PaymentGateway Method,
    PaymentStatus Status,
    string? CheckoutUrl = null);
