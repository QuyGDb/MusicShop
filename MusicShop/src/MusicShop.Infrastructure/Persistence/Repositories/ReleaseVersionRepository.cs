using Microsoft.EntityFrameworkCore;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ReleaseVersionRepository : GenericRepository<ReleaseVersion>, IReleaseVersionRepository
{
    public ReleaseVersionRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<ReleaseVersion>> GetByReleaseIdAsync(Guid releaseId, CancellationToken ct = default)
    {
        return await _context.Set<ReleaseVersion>()
            .Include(v => v.Label)
            .Where(v => v.ReleaseId == releaseId)
            .AsNoTracking()
            .ToListAsync(ct);
    }
}
