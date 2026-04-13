using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Entities.Shop;
using CartEntity = MusicShop.Domain.Entities.Orders.Cart;

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
        CartEntity? cart = await cartRepository.GetByUserIdAsync(userId, cancellationToken);

        if (cart == null || cart.Items.Count == 0)
        {
            return Result<CreateOrderResponse>.Failure(OrderErrors.CartEmpty);
        }

        // 2. Prepare Order
        Order order = new()
        {
            CustomerId = userId,
            ShippingName = request.ShippingName,
            ShippingPhone = request.ShippingPhone,
            ShippingAddress = request.ShippingAddress,
            Note = request.Note,
            Status = OrderStatus.Pending
        };

        decimal totalAmount = 0;

        foreach (CartItem cartItem in cart.Items)
        {
            // 3. Fetch tracked variant and its product
            // We re-fetch to ensure variants are tracked for stock reduction
            ProductVariant? variant = await productRepository.GetVariantByIdAsync(cartItem.Variant.ProductId, cartItem.VariantId, cancellationToken);
            
            if (variant == null)
            {
                return Result<CreateOrderResponse>.Failure(ProductErrors.VariantNotFound);
            }

            // 4. Stock check (only for non-preorder products)
            if (!variant.Product.IsPreorder)
            {
                if (variant.StockQty < cartItem.Quantity)
                {
                    return Result<CreateOrderResponse>.Failure(ProductErrors.InsufficientStock);
                }

                variant.StockQty -= cartItem.Quantity;
            }

            // 5. Create OrderItem and Price Snapshot
            OrderItem orderItem = new()
            {
                VariantId = cartItem.VariantId,
                Quantity = cartItem.Quantity,
                PriceSnapshot = variant.Price,
                ProductNameSnapshot = $"{variant.Product.Name} ({variant.VariantName})"
            };

            order.OrderItems.Add(orderItem);
            totalAmount += variant.Price * cartItem.Quantity;
        }

        order.TotalAmount = totalAmount;

        // 6. Initialize Payment & Create Session
        Payment payment = new()
        {
            Amount = totalAmount,
            Gateway = request.PaymentMethod,
            Status = PaymentStatus.Pending
        };
        
        var stripeResult = await stripeService.CreateCheckoutSessionAsync(
            order, 
            request.SuccessUrl ?? "https://localhost:5001/checkout/success", 
            request.CancelUrl ?? "https://localhost:5001/checkout/cancel", 
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
            new PaymentSummaryDto(payment.Id, payment.Gateway, payment.Status, checkoutUrl)
        ));
    }
}
