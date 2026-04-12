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
}
