using System.Text.Json;
using MusicShop.Application.Common.Constants;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.Events;
using MusicShop.Domain.Entities.Messaging;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.UpdateOrderStatus.Actions;

public sealed class ConfirmOrderAction(
    ICartRepository cartRepository,
    IRepository<Message> messageRepository,
    IJobService jobService) : IOrderStatusAction
{
    public bool CanHandle(OrderStatus from, OrderStatus to)
        => from == OrderStatus.Pending && to == OrderStatus.Confirmed;

    public async Task ExecuteAsync(Order order, UpdateOrderStatusCommand request, CancellationToken ct)
    {
        // 1. Deduct stock
        foreach (OrderItem orderItem in order.OrderItems)
        {
            if (orderItem.Product != null && !orderItem.Product.IsPreorder)
            {
                orderItem.Product.StockQty -= orderItem.Quantity;
            }
        }

        // 2. Mark payment as Paid
        if (order.Payment != null)
        {
            order.Payment.Status = PaymentStatus.Paid;
            order.Payment.PaidAt = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(request.TransactionCode))
            {
                order.Payment.TransactionCode = request.TransactionCode;
            }
        }

        // 3. Clear user's cart
        MusicShop.Domain.Entities.Orders.Cart? cart = await cartRepository.GetByUserIdAsync(order.UserId, ct);
        if (cart != null)
        {
            await cartRepository.ClearCartAsync(cart.Id, ct);
        }

        // 4. Create Outbox message for fulfillment
        string idempotencyKey = MessageTypes.BuildKey(MessageTypes.Orders.Created, order.Id);

        Message outbox = new()
        {
            Direction = MessageDirection.Outbox,
            Type = MessageTypes.Orders.Created,
            IdempotencyKey = idempotencyKey,
            Payload = JsonSerializer.Serialize(new OrderCreatedEvent
            {
                OrderId = order.Id,
                UserId = order.UserId,
                Total = order.TotalAmount,
                CreatedAt = order.CreatedAt
            })
        };

        messageRepository.Add(outbox);
    }
}
