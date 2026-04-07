using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.System;

public class NotificationLog : BaseEntity
{
    public Guid UserId { get; set; }
    public string Type { get; set; } = string.Empty; // order_created, etc.
    public Guid ReferenceId { get; set; } // order id, etc.
    public string Channel { get; set; } = "email";
    public string Status { get; set; } = "pending"; // pending, sent, failed
    public DateTime? SentAt { get; set; }
    public string? ErrorMessage { get; set; }
}
