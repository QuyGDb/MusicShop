using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Orders;

public sealed class ProcessedWebhookEvent : BaseEntity
{
    public string StripeEventId { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}
