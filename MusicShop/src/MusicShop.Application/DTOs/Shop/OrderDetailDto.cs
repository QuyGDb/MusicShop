using MusicShop.Domain.Enums;

namespace MusicShop.Application.DTOs.Shop;

public sealed record OrderDetailDto(
    Guid Id,
    OrderStatus Status,
    string ShippingName,
    string ShippingPhone,
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
    OrderItemVariantDto Variant);

public sealed record OrderItemVariantDto(
    Guid Id,
    string VariantName,
    OrderItemProductDto Product);

public sealed record OrderItemProductDto(
    Guid Id,
    string Name,
    string? CoverUrl);

public sealed record PaymentDetailDto(
    PaymentGateway Method,
    PaymentStatus Status,
    DateTime? PaidAt,
    string? TransactionId);
