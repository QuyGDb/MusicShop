using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Entities.Customer;
using MusicShop.Infrastructure.Persistence;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ReviewRepository(AppDbContext context) : IReviewRepository
{
    private readonly DbSet<Review> _dbSet = context.Reviews;

    public async Task<(IReadOnlyList<Review> Items, int TotalCount)> GetPagedByProductIdAsync(
        Guid productId, 
        int page, 
        int limit, 
        CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking()
            .Where(r => r.ProductId == productId)
            .Include(r => r.User);

        int totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync(ct);

        return (items, totalCount);
    }
}
