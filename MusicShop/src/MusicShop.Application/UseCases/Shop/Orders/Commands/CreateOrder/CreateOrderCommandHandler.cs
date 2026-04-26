using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.CreateOrder;

public sealed class CreateOrderCommandHandler(
    ICartRepository cartRepository,
    IOrderRepository orderRepository,
    IProductRepository productRepository,
    IUnitOfWork unitOfWork,
    ICurrentUserService currentUserService,
    IStripeService stripeService) : IRequestHandler<CreateOrderCommand, Result<CreateOrderResponse>>
{
    public async Task<Result<CreateOrderResponse>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(currentUserService.UserId))
        {
            return Result<CreateOrderResponse>.Failure(AuthErrors.Unauthorized);
        }

        Guid userId = Guid.Parse(currentUserService.UserId);

        // 1. Fetch cart with items
        Domain.Entities.Orders.Cart? cart = await cartRepository.GetByUserIdAsync(userId, cancellationToken);

        if (cart == null || cart.Items.Count == 0)
        {
            return Result<CreateOrderResponse>.Failure(OrderErrors.CartEmpty);
        }

        // 2. Prepare Order
        Order order = new()
        {
            UserId = userId,
            RecipientName = request.RecipientName,
            Phone = request.Phone,
            ShippingAddress = request.ShippingAddress,
            Note = request.Note,
            Status = OrderStatus.Pending
        };

        decimal totalAmount = 0;

        foreach (CartItem cartItem in cart.Items)
        {
            // 3. Fetch tracked product
            // We re-fetch to ensure products are tracked for stock reduction
            Product? product = await productRepository.FirstOrDefaultAsync(p => p.Id == cartItem.ProductId, cancellationToken);

            if (product == null)
            {
                return Result<CreateOrderResponse>.Failure(ProductErrors.NotFound);
            }

            // 4. Stock check (only for non-preorder products)
            if (!product.IsPreorder)
            {
                if (product.StockQty < cartItem.Quantity)
                {
                    return Result<CreateOrderResponse>.Failure(ProductErrors.InsufficientStock);
                }

                product.StockQty -= cartItem.Quantity;
            }

            // 5. Create OrderItem and Price Snapshot
            OrderItem orderItem = new()
            {
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                PriceSnapshot = product.Price,
                ProductNameSnapshot = product.Name
            };

            order.OrderItems.Add(orderItem);
            totalAmount += product.Price * cartItem.Quantity;
        }

        order.TotalAmount = totalAmount;

        // 6. Initialize Payment & Create Session
        Payment payment = new()
        {
            Amount = totalAmount,
            Method = request.PaymentGateway,
            Status = PaymentStatus.Pending
        };

        Result<StripeCheckoutDto> stripeResult = await stripeService.CreateCheckoutSessionAsync(
            order,
            request.SuccessUrl ?? "https://localhost:5000/checkout/success",
            request.CancelUrl ?? "https://localhost:5000/checkout/cancel",
            cancellationToken);

        if (!stripeResult.IsSuccess)
        {
            return Result<CreateOrderResponse>.Failure(stripeResult.Error);
        }

        string checkoutUrl = stripeResult.Value.Url;

        order.Payment = payment;

        // 7. Save Order and Clear Cart
        orderRepository.Add(order);
        await cartRepository.ClearCartAsync(cart.Id, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<CreateOrderResponse>.Success(new CreateOrderResponse(
            new OrderSummaryDto(order.Id, order.Status, order.TotalAmount, order.CreatedAt),
            new PaymentSummaryDto(payment.Id, payment.Method, payment.Status, checkoutUrl)
        ));
    }
}
