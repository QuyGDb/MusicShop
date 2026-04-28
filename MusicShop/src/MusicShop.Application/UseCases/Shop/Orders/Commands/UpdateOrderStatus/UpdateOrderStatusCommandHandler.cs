using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.UpdateOrderStatus;

public sealed class UpdateOrderStatusCommandHandler(
    IOrderRepository orderRepository,
    ICartRepository cartRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<UpdateOrderStatusCommand, Result>
{
    public async Task<Result> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        Order? order = await orderRepository.GetByIdWithDetailsAsync(request.OrderId, cancellationToken);

        if (order == null)
        {
            return Result.Failure(OrderErrors.NotFound);
        }

        if (order.Status == request.Status)
        {
            return Result.Success();
        }

        // Logic 1: Transition TO Confirmed (Payment Success)
        if (request.Status == OrderStatus.Confirmed && order.Status == OrderStatus.Pending)
        {
            // 1. Deduct stock now that we have real money
            foreach (OrderItem orderItem in order.OrderItems)
            {
                if (orderItem.Product != null && !orderItem.Product.IsPreorder)
                {
                    // Re-validate stock just in case it was sold out while waiting for payment
                    if (orderItem.Product.StockQty < orderItem.Quantity)
                    {
                        // In a real system, you might mark the order as "StockIssue" 
                        // and trigger a refund/manual review instead of just failing.
                    }
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

            // 3. Clear user's cart (Snapshot: we use order.UserId to find the cart)
            MusicShop.Domain.Entities.Orders.Cart? cart = await cartRepository.GetByUserIdAsync(order.UserId, cancellationToken);
            if (cart != null)
            {
                await cartRepository.ClearCartAsync(cart.Id, cancellationToken);
            }
        }
        // Logic 2: Transition TO Cancelled from something that already had stock deducted (Confirmed/Shipped/etc)
        else if (request.Status == OrderStatus.Cancelled &&
                 (order.Status == OrderStatus.Confirmed || order.Status == OrderStatus.Shipped || order.Status == OrderStatus.Delivered))
        {
            foreach (OrderItem orderItem in order.OrderItems)
            {
                if (orderItem.Product != null && !orderItem.Product.IsPreorder)
                {
                    orderItem.Product.StockQty += orderItem.Quantity;
                }
            }
        }

        order.Status = request.Status;

        if (!string.IsNullOrEmpty(request.TrackingNumber))
        {
            order.TrackingNumber = request.TrackingNumber;
        }

        order.UpdatedAt = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return MusicShop.Domain.Common.Result.Success();
    }
}
