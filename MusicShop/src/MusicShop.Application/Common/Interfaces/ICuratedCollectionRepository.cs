using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Application.Common.Interfaces;

public interface ICuratedCollectionRepository
{
    Task<IReadOnlyList<CuratedCollection>> GetPublishedAsync(CancellationToken ct = default);
    Task<CuratedCollection?> GetByIdWithItemsAsync(Guid id, CancellationToken ct = default);
    Task<CuratedCollection?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(CuratedCollection collection, CancellationToken ct = default);
    Task UpdateAsync(CuratedCollection collection, CancellationToken ct = default);
    Task DeleteAsync(CuratedCollection collection, CancellationToken ct = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken ct = default);
    
    // Items
    Task AddItemAsync(CuratedCollectionItem item, CancellationToken ct = default);
    Task RemoveItemAsync(Guid collectionId, Guid productId, CancellationToken ct = default);
    Task<bool> ItemExistsAsync(Guid collectionId, Guid productId, CancellationToken ct = default);
    Task<int> GetNextSortOrderAsync(Guid collectionId, CancellationToken ct = default);
}
