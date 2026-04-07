using System.Collections.Generic;
using MusicShop.Domain.Common;


namespace MusicShop.Domain.Entities.Orders;

public class Cart : BaseEntity
{
    public Guid UserId { get; set; }
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
