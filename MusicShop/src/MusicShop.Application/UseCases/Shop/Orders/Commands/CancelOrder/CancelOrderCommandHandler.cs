using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.CancelOrder;

public sealed class CancelOrderCommandHandler(
    IOrderRepository orderRepository,
    IUnitOfWork unitOfWork,
    ICurrentUserService currentUserService) : IRequestHandler<CancelOrderCommand, Result>
{
    public async Task<Result> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.GetByIdWithDetailsAsync(request.OrderId, cancellationToken);
        
        if (order == null)
        {
            return Result.Failure(OrderErrors.NotFound);
        }

        // Authorization: Only Owner can cancel (Admin usually uses update status endpoint)
        var userId = Guid.Parse(currentUserService.UserId!);
        if (order.CustomerId != userId)
        {
            return Result.Failure(OrderErrors.NotFound);
        }

        // Validity: Only Pending orders can be cancelled
        if (order.Status != OrderStatus.Pending)
        {
            return Result.Failure(OrderErrors.CannotCancel);
        }

        // Logic: Restore stock
        foreach (var item in order.OrderItems)
        {
            // Only restore stock for non-preorder products
            if (!item.Variant.Product.IsPreorder)
            {
                item.Variant.StockQty += item.Quantity;
            }
        }

        // Update status
        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
