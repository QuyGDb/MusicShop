using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Customer;

public class UserCollection : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    
    // User can add products they already own
    public string? Notes { get; set; }
}
