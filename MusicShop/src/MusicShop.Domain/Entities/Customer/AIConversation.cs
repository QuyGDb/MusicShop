using System.Collections.Generic;
using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Customer;

public class AIConversation : BaseEntity
{
    public Guid? UserId { get; set; }
    public string? SessionToken { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;

    public ICollection<AIMessage> Messages { get; set; } = new List<AIMessage>();
}
