using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.UpdateOrderStatus;

public sealed class UpdateOrderStatusCommandHandler(
    IOrderRepository orderRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<UpdateOrderStatusCommand, Result>
{
    public async Task<Result> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.GetByIdWithDetailsAsync(request.OrderId, cancellationToken);

        if (order == null)
        {
            return Result.Failure(OrderErrors.NotFound);
        }

        // Logic: If transitioning TO Cancelled from something else, restore stock
        if (request.Status == OrderStatus.Cancelled && order.Status != OrderStatus.Cancelled)
        {
            foreach (var item in order.OrderItems)
            {
                if (!item.Variant.Product.IsPreorder)
                {
                    item.Variant.StockQty += item.Quantity;
                }
            }
        }
        // Optional logic: If transitioning FROM Cancelled to something else, reduce stock?
        // (Usually not recommended without re-validating stock, but let's keep it simple as Admin bypass)
        else if (order.Status == OrderStatus.Cancelled && request.Status != OrderStatus.Cancelled)
        {
            foreach (var item in order.OrderItems)
            {
                if (!item.Variant.Product.IsPreorder)
                {
                    item.Variant.StockQty -= item.Quantity;
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

        return Result.Success();
    }
}
