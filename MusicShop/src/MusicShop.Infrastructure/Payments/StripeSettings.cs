using System.ComponentModel.DataAnnotations;

namespace MusicShop.Infrastructure.Payments;

public sealed class StripeSettings
{
    public const string SectionName = "Stripe";

    [Required]
    public string PublishableKey { get; init; } = string.Empty;

    [Required]
    public string SecretKey { get; init; } = string.Empty;

    [Required]
    public string WebhookSecret { get; init; } = string.Empty;

    public string Currency { get; init; } = "usd";
}
