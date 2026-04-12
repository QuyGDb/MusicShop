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
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<CuratedCollection?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.CuratedCollections.FindAsync([id], ct);
    }

    public async Task AddAsync(CuratedCollection collection, CancellationToken ct = default)
    {
        context.CuratedCollections.Add(collection);
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(CuratedCollection collection, CancellationToken ct = default)
    {
        context.CuratedCollections.Update(collection);
        await context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(CuratedCollection collection, CancellationToken ct = default)
    {
        context.CuratedCollections.Remove(collection);
        await context.SaveChangesAsync(ct);
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken ct = default)
    {
        return await context.CuratedCollections.AnyAsync(c => c.Id == id, ct);
    }

    public async Task AddItemAsync(CuratedCollectionItem item, CancellationToken ct = default)
    {
        context.Set<CuratedCollectionItem>().Add(item);
        await context.SaveChangesAsync(ct);
    }

    public async Task RemoveItemAsync(Guid collectionId, Guid productId, CancellationToken ct = default)
    {
        var item = await context.Set<CuratedCollectionItem>()
            .FirstOrDefaultAsync(i => i.CollectionId == collectionId && i.ProductId == productId, ct);
        
        if (item != null)
        {
            context.Set<CuratedCollectionItem>().Remove(item);
            await context.SaveChangesAsync(ct);
        }
    }

    public async Task<bool> ItemExistsAsync(Guid collectionId, Guid productId, CancellationToken ct = default)
    {
        return await context.Set<CuratedCollectionItem>()
            .AnyAsync(i => i.CollectionId == collectionId && i.ProductId == productId, ct);
    }

    public async Task<int> GetNextSortOrderAsync(Guid collectionId, CancellationToken ct = default)
    {
        var maxOrder = await context.Set<CuratedCollectionItem>()
            .Where(i => i.CollectionId == collectionId)
            .MaxAsync(i => (int?)i.SortOrder, ct) ?? 0;
        
        return maxOrder + 1;
    }
}
