using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.UseCases.Catalog.Genres.Queries.GetGenres;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class GenreRepository : GenericRepository<Genre>, IGenreRepository
{
    public GenreRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<(IReadOnlyList<Genre> Items, int TotalCount)> GetPagedAsync(
        GetGenresQuery request, 
        CancellationToken ct = default)
    {
        IQueryable<Genre> query = _context.Set<Genre>().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            query = query.Where(x => x.Name.Contains(request.Q));
        }

        int totalCount = await query.CountAsync(ct);

        List<Genre> items = await query
            .OrderBy(x => x.Name)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<Genre?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        return await _context.Set<Genre>()
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug, ct);
    }

    public async Task<Genre?> GetWithAssociationsAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Set<Genre>()
            .Include(x => x.ArtistGenres)
            .Include(x => x.ReleaseGenres)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<Genre?> GetWithAssociationsBySlugAsync(string slug, CancellationToken ct = default)
    {
        return await _context.Set<Genre>()
            .Include(x => x.ArtistGenres)
            .Include(x => x.ReleaseGenres)
            .FirstOrDefaultAsync(x => x.Slug == slug, ct);
    }
}
