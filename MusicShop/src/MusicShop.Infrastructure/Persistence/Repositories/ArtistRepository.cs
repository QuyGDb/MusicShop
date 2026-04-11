using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtists;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ArtistRepository : GenericRepository<Artist>, IArtistRepository
{
    public ArtistRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Artist?> GetWithGenresAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Artist>()
            .Include(x => x.ArtistGenres)
                .ThenInclude(x => x.Genre)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Artist?> GetWithGenresBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Artist>()
            .Include(x => x.ArtistGenres)
                .ThenInclude(x => x.Genre)
            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);
    }

    public async Task<Artist?> GetWithReleasesBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Artist>()
            .Include(x => x.Releases)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);
    }

    public async Task<(IReadOnlyList<Artist> Items, int TotalCount)> GetPagedAsync(
        GetArtistsQuery request,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Artist> query = _context.Set<Artist>()
            .Include(x => x.ArtistGenres)
                .ThenInclude(x => x.Genre)
            .AsNoTracking();

        // 1. Apply Filtering
        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            query = query.Where(a => a.Name.Contains(request.Q));
        }

        if (request.GenreId.HasValue)
        {
            query = query.Where(a => a.ArtistGenres.Any(ag => ag.GenreId == request.GenreId.Value));
        }

        // 2. Wrap into TotalCount and Paging
        int totalCount = await query.CountAsync(cancellationToken);

        List<Artist> items = await query
            .OrderBy(a => a.Name)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<List<Artist>> SearchByNameAsync(string searchTerm, int limit, CancellationToken ct = default)
    {
        searchTerm = searchTerm.ToLower();

        return await _context.Set<Artist>()
            .Include(x => x.ArtistGenres)
                .ThenInclude(x => x.Genre)
            .Where(a => a.Name.ToLower().Contains(searchTerm))
            .Take(limit)
            .ToListAsync(ct);
    }
}
