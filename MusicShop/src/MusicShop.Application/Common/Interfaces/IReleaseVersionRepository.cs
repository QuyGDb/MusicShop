using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.Common.Interfaces;

public interface IReleaseVersionRepository : IRepository<ReleaseVersion>
{
    Task<List<ReleaseVersion>> GetByReleaseIdWithLabelAsync(Guid releaseId, CancellationToken ct = default);
}
