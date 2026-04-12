using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Infrastructure.Persistence;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class CuratedCollectionRepository(AppDbContext context) : ICuratedCollectionRepository
{
    public async Task<IReadOnlyList<CuratedCollection>> GetPublishedAsync(CancellationToken ct = default)
    {
        return await context.CuratedCollections
            .AsNoTracking()
            .Where(c => c.IsPublished)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<CuratedCollection?> GetByIdWithItemsAsync(Guid id, CancellationToken ct = default)
    {
        return await context.CuratedCollections
            .Include(c => c.Items.OrderBy(i => i.SortOrder))
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.ReleaseVersion)
                        .ThenInclude(rv => rv.Release)
                            .ThenInclude(r => r.Artist)
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Variants)
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Reviews)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }
}
