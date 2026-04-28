using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.UpdateOrderStatus;

public sealed record UpdateOrderStatusCommand(
    Guid OrderId,
    OrderStatus Status,
    string? TrackingNumber,
    string? TransactionCode = null) : IRequest<MusicShop.Domain.Common.Result>;
