using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleases;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ReleaseRepository : GenericRepository<Release>, IReleaseRepository
{
    public ReleaseRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<(IReadOnlyList<Release> Items, int TotalCount)> GetPagedAsync(
        GetReleasesQuery request,
        CancellationToken ct = default)
    {
        IQueryable<Release> query = _context.Set<Release>()
            .Include(x => x.Artist)
            .Include(x => x.ReleaseGenres)
                .ThenInclude(x => x.Genre)
            .AsNoTracking();

        // 1. Filtering
        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            query = query.Where(r => r.Title.Contains(request.Q));
        }

        if (request.ArtistId.HasValue)
        {
            query = query.Where(r => r.ArtistId == request.ArtistId.Value);
        }

        if (request.GenreId.HasValue)
        {
            query = query.Where(r => r.ReleaseGenres.Any(rg => rg.GenreId == request.GenreId.Value));
        }

        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            query = query.Where(r => r.Type == request.Type);
        }

        if (!string.IsNullOrWhiteSpace(request.Format))
        {
            if (Enum.TryParse<ReleaseFormat>(request.Format, true, out ReleaseFormat formatEnum))
            {
                query = query.Where(r => r.Versions.Any(v => v.Format == formatEnum));
            }
        }

        // 2. Count Total
        int totalCount = await query.CountAsync(ct);

        // 3. Paging and Sorting
        List<Release> items = await query
            .OrderByDescending(r => r.Year)
            .ThenBy(r => r.Title)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<Release?> GetWithDetailsAsync(Guid id, bool track = false, CancellationToken ct = default)
    {
        var query = _context.Set<Release>()
            .Include(x => x.Artist)
            .Include(x => x.ReleaseGenres)
                .ThenInclude(x => x.Genre)
            .Include(x => x.Tracks.OrderBy(t => t.Position))
            .Include(x => x.Versions)
                .ThenInclude(x => x.Label)
            .Include(x => x.Versions)
                .ThenInclude(v => v.Products)
                    .ThenInclude(p => p.Variants)
            .AsQueryable();

        if (!track)
        {
            query = query.AsNoTracking();
        }

        return await query.FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<List<Release>> SearchByTitleAsync(string searchTerm, int limit, CancellationToken ct = default)
    {
        searchTerm = searchTerm.ToLower();

        return await _context.Set<Release>()
            .Include(r => r.Artist)
            .Include(r => r.ReleaseGenres)
                .ThenInclude(rg => rg.Genre)
            .Where(r => r.Title.ToLower().Contains(searchTerm))
            .Take(limit)
            .ToListAsync(ct);
    }
}
