using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Enums;
using MusicShop.Infrastructure.Persistence;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Order?> GetByIdWithDetailsAsync(Guid orderId, CancellationToken ct = default)
    {
        return await _dbSet
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Variant)
                    .ThenInclude(v => v.Product)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == orderId, ct);
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await _dbSet
            .Where(o => o.CustomerId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<(IReadOnlyList<Order> Items, int TotalCount)> GetPagedByUserIdAsync(
        Guid userId, 
        OrderStatus? status, 
        int page, 
        int limit, 
        CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking()
            .Where(o => o.CustomerId == userId)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(o => o.Status == status.Value);
        }

        int totalCount = await query.CountAsync(ct);

        var items = await query
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync(ct);

        return (items, totalCount);
    }
}
