using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public sealed record OrderDetailDto(
    Guid Id,
    OrderStatus Status,
    string RecipientName,
    string Email,
    string Phone,
    string ShippingAddress,
    string? Note,
    decimal TotalAmount,
    string? TrackingNumber,
    DateTime CreatedAt,
    IReadOnlyList<OrderItemDetailDto> Items,
    PaymentDetailDto? Payment);

public sealed record OrderItemDetailDto(
    Guid Id,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal,
    Guid ProductId,
    string ProductName,
    string? ProductCoverUrl);

public sealed record PaymentDetailDto(
    PaymentGateway Method,
    PaymentStatus Status,
    DateTime? PaidAt,
    string? TransactionCode);
