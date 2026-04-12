using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Application.Common.Interfaces;

public interface ICuratedCollectionRepository
{
    Task<IReadOnlyList<CuratedCollection>> GetPublishedAsync(CancellationToken ct = default);
}
