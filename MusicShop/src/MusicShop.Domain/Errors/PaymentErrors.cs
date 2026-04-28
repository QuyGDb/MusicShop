using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class PaymentErrors
{
    public static readonly Error StripeError = new(
        "Payment.StripeError",
        "An error occurred while processing the payment with Stripe.",
        ErrorType.Failure);

    public static readonly Error WebhookError = new(
        "Payment.WebhookError",
        "An error occurred while processing the payment webhook.",
        ErrorType.Failure);

    public static readonly Error InvalidWebhookEvent = new(
        "Payment.InvalidWebhookEvent",
        "The received webhook event is invalid or not supported.",
        ErrorType.Failure);

    public static Error CustomStripeError(string message) => new(
        "Payment.StripeFailure",
        message,
        ErrorType.Failure);
}
