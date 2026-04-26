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
            .Where(collection => collection.IsPublished)
            .OrderBy(collection => collection.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<CuratedCollection?> GetByIdWithItemsAsync(Guid id, CancellationToken ct = default)
    {
        return await context.CuratedCollections
            .Include(collection => collection.Items.OrderBy(item => item.SortOrder))
                .ThenInclude(item => item.Product)
            .Include(collection => collection.Items)
                .ThenInclude(item => item.Product)
                    .ThenInclude(product => product.ReleaseVersion)
                        .ThenInclude(releaseVersion => releaseVersion!.Release)
                            .ThenInclude(release => release!.Artist)
            .AsNoTracking()
            .FirstOrDefaultAsync(collection => collection.Id == id, ct);
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
        return await context.CuratedCollections.AnyAsync(collection => collection.Id == id, ct);
    }

    public async Task AddItemAsync(CuratedCollectionItem item, CancellationToken ct = default)
    {
        context.Set<CuratedCollectionItem>().Add(item);
        await context.SaveChangesAsync(ct);
    }

    public async Task RemoveItemAsync(Guid collectionId, Guid productId, CancellationToken ct = default)
    {
        CuratedCollectionItem? item = await context.Set<CuratedCollectionItem>()
            .FirstOrDefaultAsync(item => item.CollectionId == collectionId && item.ProductId == productId, ct);

        if (item != null)
        {
            context.Set<CuratedCollectionItem>().Remove(item);
            await context.SaveChangesAsync(ct);
        }
    }

    public async Task<bool> ItemExistsAsync(Guid collectionId, Guid productId, CancellationToken ct = default)
    {
        return await context.Set<CuratedCollectionItem>()
            .AnyAsync(item => item.CollectionId == collectionId && item.ProductId == productId, ct);
    }

    public async Task<int> GetNextSortOrderAsync(Guid collectionId, CancellationToken ct = default)
    {
        int maxOrder = await context.Set<CuratedCollectionItem>()
            .Where(item => item.CollectionId == collectionId)
            .MaxAsync(item => (int?)item.SortOrder, ct) ?? 0;

        return maxOrder + 1;
    }
}
