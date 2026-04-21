using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.CreateOrder;

public record CreateOrderCommand(
    string RecipientName,
    string Phone,
    string ShippingAddress,
    PaymentGateway PaymentGateway,
    string? SuccessUrl = null,
    string? CancelUrl = null,
    string? Note = null) : IRequest<Result<CreateOrderResponse>>;
