using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Customer;

public class WantlistItem : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    
    // Last time the user was notified about restock
    public DateTime? LastNotifiedAt { get; set; }
}
