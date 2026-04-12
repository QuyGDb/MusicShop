using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.CreateOrder;

public sealed record CreateOrderCommand(
    string ShippingName,
    string ShippingPhone,
    string ShippingAddress,
    PaymentGateway PaymentMethod,
    string? Note = null) : IRequest<Result<CreateOrderResponse>>;
