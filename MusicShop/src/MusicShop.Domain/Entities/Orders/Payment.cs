using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Domain.Entities.Orders;

public class Payment : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public PaymentGateway Method { get; set; }
    public string? TransactionCode { get; set; }
    public DateTime? PaidAt { get; set; }
}
