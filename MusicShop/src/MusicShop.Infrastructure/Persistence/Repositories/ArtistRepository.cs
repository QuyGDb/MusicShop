using Microsoft.EntityFrameworkCore;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ArtistRepository : GenericRepository<Artist>, IArtistRepository
{
    public ArtistRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Artist?> GetWithGenresAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Set<Artist>()
            .Include(x => x.ArtistGenres)
                .ThenInclude(x => x.Genre)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<(IReadOnlyList<Artist> Items, int TotalCount)> GetPagedWithGenresAsync(
        int pageNumber, 
        int pageSize, 
        CancellationToken ct = default)
    {
        IQueryable<Artist> query = _context.Set<Artist>()
            .Include(x => x.ArtistGenres)
                .ThenInclude(x => x.Genre)
            .AsNoTracking();

        int totalCount = await query.CountAsync(ct);

        List<Artist> items = await query
            .OrderBy(x => x.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }
}
