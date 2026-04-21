using System.Collections.Generic;
using MusicShop.Domain.Common;

using MusicShop.Domain.Enums;

namespace MusicShop.Domain.Entities.Orders;

public class Order : BaseEntity
{
    public Guid UserId { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }

    public string RecipientName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string? TrackingNumber { get; set; }
    public string? Note { get; set; }

    public Guid? CancelledBy { get; set; }
    public string? CancelReason { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public Payment? Payment { get; set; }
}
