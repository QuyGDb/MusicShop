using MusicShop.Domain.Entities.Catalog;

namespace MusicShop.Domain.Interfaces;

public interface IReleaseRepository : IRepository<Release>
{
    // Lấy thông tin Album kèm theo thông tin Nghệ sĩ (Eager Loading)
    Task<Release?> GetWithArtistAsync(Guid id, CancellationToken ct = default);
}
