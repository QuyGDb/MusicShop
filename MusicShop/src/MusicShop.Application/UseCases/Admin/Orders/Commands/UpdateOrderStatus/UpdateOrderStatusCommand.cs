using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Admin.Orders.Commands.UpdateOrderStatus;

public sealed record UpdateOrderStatusCommand(
    Guid OrderId,
    OrderStatus Status,
    string? TrackingNumber) : IRequest<Result>;
