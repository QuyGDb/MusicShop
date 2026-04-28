using Microsoft.Extensions.Logging;
using MusicShop.Application.Common.Models;
using Microsoft.Extensions.Options;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Errors;
using Stripe;
using Stripe.Checkout;
using MusicShop.Application.UseCases.Shop.Orders.Commands.UpdateOrderStatus;
using MusicShop.Domain.Enums;

namespace MusicShop.Infrastructure.Payments;

public sealed class StripeService(
    IOptions<StripeSettings> settings,
    ILogger<StripeService> logger) : IStripeService
{
    private readonly StripeSettings _settings = settings.Value;

    public async Task<Result<StripeCheckoutDto>> CreateCheckoutSessionAsync(
        Order order,
        string successUrl,
        string cancelUrl,
        CancellationToken cancellationToken = default)
    {
        try
        {
            SessionService sessionService = new();
            List<SessionLineItemOptions> lineItems = order.OrderItems.Select(item => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = ConvertToStripeAmount(item.PriceSnapshot),
                    Currency = _settings.Currency,
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = item.Product?.Name ?? (string.IsNullOrWhiteSpace(item.ProductNameSnapshot) ? "Music Item" : item.ProductNameSnapshot),
                        Description = item.ProductNameSnapshot
                    },
                },
                Quantity = item.Quantity,
            }).ToList();

            SessionCreateOptions options = new SessionCreateOptions
            {
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl,
                Metadata = new Dictionary<string, string>
                {
                    { "OrderId", order.Id.ToString() }
                },
                ClientReferenceId = order.Id.ToString(),
                // Optionally pre-fill customer email if available in order/user context
                // CustomerEmail = order.User?.Email, 
                ExpiresAt = DateTime.UtcNow.AddMinutes(30)
            };

            Session session = await sessionService.CreateAsync(options, cancellationToken: cancellationToken);

            if (string.IsNullOrEmpty(session.Url))
            {
                logger.LogError("Stripe session URL is null or empty. SessionId: {SessionId}", session.Id);
                return Result<StripeCheckoutDto>.Failure(PaymentErrors.CustomStripeError("Stripe failed to generate a checkout URL."));
            }

            return Result<StripeCheckoutDto>.Success(new StripeCheckoutDto(session.Id, session.Url));
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe exception during session creation for Order {OrderId}", order.Id);
            return Result<StripeCheckoutDto>.Failure(PaymentErrors.CustomStripeError(ex.Message));
        }
    }

    public Task<WebhookProcessResult> HandleWebhookAsync(
        string json,
        string signature,
        CancellationToken cancellationToken = default)
    {
        try
        {
            Event stripeEvent = EventUtility.ConstructEvent(json, signature, _settings.WebhookSecret);

            return Task.FromResult(stripeEvent.Type switch
            {
                "checkout.session.completed" => HandleCheckoutCompleted(stripeEvent),
                _ => WebhookProcessResult.Ignored(stripeEvent.Type)
            });
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe webhook signature verification failed");
            return Task.FromResult(WebhookProcessResult.Failure(PaymentErrors.CustomStripeError(ex.Message)));
        }
    }

    private WebhookProcessResult HandleCheckoutCompleted(Event stripeEvent)
    {
        if (stripeEvent.Data.Object is not Session session)
        {
            return WebhookProcessResult.Failure(PaymentErrors.InvalidWebhookEvent);
        }

        if (!session.Metadata.TryGetValue("OrderId", out string? orderIdStr) || !Guid.TryParse(orderIdStr, out Guid orderId))
        {
            return WebhookProcessResult.Failure(PaymentErrors.InvalidWebhookEvent);
        }
        // We use OrderStatus.Confirmed as the "Paid/Processing" status in this system
        UpdateOrderStatusCommand command = new(orderId, OrderStatus.Confirmed, null, session.Id);
        return WebhookProcessResult.ShouldProcess(stripeEvent.Id, stripeEvent.Type, command);
    }

    private static long ConvertToStripeAmount(decimal price)
        => (long)Math.Round(price * 100, MidpointRounding.AwayFromZero);
}
