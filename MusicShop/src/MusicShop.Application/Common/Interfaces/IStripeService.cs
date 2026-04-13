using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Orders;

namespace MusicShop.Application.Common.Interfaces;

public interface IStripeService
{
    Task<Result<StripeCheckoutDto>> CreateCheckoutSessionAsync(
        Order order, 
        string successUrl, 
        string cancelUrl, 
        CancellationToken ct = default);

    /// <summary>
    /// Verifies the webhook signature and returns the event data if valid.
    /// This is used in the Infrastructure layer to handle Stripe webhooks.
    /// </summary>
    Task<Result<string>> HandleWebhookAsync(string json, string signature, CancellationToken ct = default);
}
