using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Entities.Orders;
using Stripe;
using Stripe.Checkout;

namespace MusicShop.Infrastructure.Payments;

public sealed class StripeService : IStripeService
{
    private readonly StripeSettings _settings;
    private readonly ILogger<StripeService> _logger;

    public StripeService(IOptions<StripeSettings> settings, ILogger<StripeService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
        StripeConfiguration.ApiKey = _settings.SecretKey;
    }

    public async Task<Result<StripeCheckoutDto>> CreateCheckoutSessionAsync(
        Order order,
        string successUrl,
        string cancelUrl,
        CancellationToken ct = default)
    {
        try
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = [],
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl,
                Metadata = new Dictionary<string, string>
                {
                    { "OrderId", order.Id.ToString() }
                }
            };

            foreach (var item in order.OrderItems)
            {
                options.LineItems.Add(new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(item.PriceSnapshot * 100), // Stripe uses cents
                        Currency = "usd", // Should probably be configurable
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.Product?.Name ?? "Music Item",
                            Description = item.ProductNameSnapshot
                        },
                    },
                    Quantity = item.Quantity,
                });
            }

            var service = new SessionService();
            Session session = await service.CreateAsync(options, cancellationToken: ct);

            return Result<StripeCheckoutDto>.Success(new StripeCheckoutDto(session.Id, session.Url));
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe session creation failed");
            return Result<StripeCheckoutDto>.Failure(PaymentErrors.StripeError);
        }
    }

    public async Task<Result<string>> HandleWebhookAsync(string json, string signature, CancellationToken ct = default)
    {
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json, signature, _settings.WebhookSecret);

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Session;
                var orderId = session?.Metadata["OrderId"];
                return Result<string>.Success(orderId ?? string.Empty);
            }

            return Result<string>.Failure(PaymentErrors.InvalidWebhookEvent);
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe webhook processing failed");
            return Result<string>.Failure(PaymentErrors.WebhookError);
        }
    }
}
