using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Infrastructure.Persistence;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class CartRepository : GenericRepository<Cart>, ICartRepository
{
    public CartRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking()
            .Include(c => c.Items)
                .ThenInclude(i => i.Variant)
                    .ThenInclude(v => v.Product)
                        .ThenInclude(p => p.ReleaseVersion)
                            .ThenInclude(rv => rv!.Release)
                                .ThenInclude(r => r!.Artist)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);
    }

    public async Task<Cart?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken ct = default)
    {
        return await _dbSet
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);
    }

    public async Task ClearCartAsync(Guid cartId, CancellationToken ct = default)
    {
        var items = await _context.Set<CartItem>()
            .Where(i => i.CartId == cartId)
            .ToListAsync(ct);

        _context.Set<CartItem>().RemoveRange(items);
    }
}
