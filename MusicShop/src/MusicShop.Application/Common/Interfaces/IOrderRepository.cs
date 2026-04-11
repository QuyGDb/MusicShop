using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.Common.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetByIdWithDetailsAsync(Guid orderId, CancellationToken ct = default);
    Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
}
