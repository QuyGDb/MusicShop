using Microsoft.EntityFrameworkCore;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ReleaseRepository : GenericRepository<Release>, IReleaseRepository
{
    public ReleaseRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Release?> GetWithArtistAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Set<Release>()
            .Include(m => m.Artist)
            .FirstOrDefaultAsync(m => m.Id == id, ct);
    }
}
