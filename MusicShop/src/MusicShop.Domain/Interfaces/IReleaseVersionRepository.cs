using MusicShop.Domain.Entities.Catalog;

namespace MusicShop.Domain.Interfaces;

public interface IReleaseVersionRepository : IRepository<ReleaseVersion>
{
    Task<IReadOnlyList<ReleaseVersion>> GetByReleaseIdAsync(Guid releaseId, CancellationToken ct = default);
}
