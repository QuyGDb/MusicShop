using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.Orders.Queries.GetOrderDetail;

public sealed class GetOrderDetailQueryHandler(
    IOrderRepository orderRepository,
    ICurrentUserService currentUserService) : IRequestHandler<GetOrderDetailQuery, Result<OrderDetailDto>>
{
    public async Task<Result<OrderDetailDto>> Handle(GetOrderDetailQuery request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.GetByIdWithDetailsAsync(request.OrderId, cancellationToken);

        if (order == null)
        {
            return Result<OrderDetailDto>.Failure(OrderErrors.NotFound);
        }

        // Authorization check: User must be Admin or the owner of the order
        var userId = Guid.Parse(currentUserService.UserId!);
        if (order.CustomerId != userId && !currentUserService.IsInRole("admin"))
        {
            // We return NotFound to avoid leaking information about order existence
            return Result<OrderDetailDto>.Failure(OrderErrors.NotFound);
        }

        var dto = new OrderDetailDto(
            order.Id,
            order.Status,
            order.ShippingName,
            order.ShippingPhone,
            order.ShippingAddress,
            order.Note,
            order.TotalAmount,
            order.TrackingNumber,
            order.CreatedAt,
            order.OrderItems.Select(oi => new OrderItemDetailDto(
                oi.Id,
                oi.Quantity,
                oi.PriceSnapshot,
                oi.PriceSnapshot * oi.Quantity,
                new OrderItemVariantDto(
                    oi.VariantId,
                    oi.Variant.VariantName,
                    new OrderItemProductDto(
                        oi.Variant.ProductId,
                        oi.Variant.Product.Name,
                        oi.Variant.Product.CoverUrl
                    )
                )
            )).ToList(),
            order.Payment != null ? new PaymentDetailDto(
                order.Payment.Gateway,
                order.Payment.Status,
                order.Payment.PaidAt,
                order.Payment.TransactionId
            ) : null);

        return Result<OrderDetailDto>.Success(dto);
    }
}
