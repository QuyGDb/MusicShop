using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleases;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ReleaseRepository(AppDbContext context) : GenericRepository<Release>(context), IReleaseRepository
{
    public async Task<(IReadOnlyList<Release> Items, int TotalCount)> GetPagedAsync(
        GetReleasesQuery request,
        CancellationToken ct = default)
    {
        IQueryable<Release> query = _context.Set<Release>()
            .Include(release => release.Artist)
            .Include(release => release.ReleaseGenres)
                .ThenInclude(releaseGenre => releaseGenre.Genre)
            .AsNoTracking();

        // 1. Filtering
        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            query = query.Where(release => release.Title.Contains(request.Q));
        }

        if (request.ArtistId.HasValue)
        {
            query = query.Where(release => release.ArtistId == request.ArtistId.Value);
        }

        if (request.GenreId.HasValue)
        {
            query = query.Where(release => release.ReleaseGenres.Any(releaseGenre => releaseGenre.GenreId == request.GenreId.Value));
        }

        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            query = query.Where(release => release.Type == request.Type);
        }

        if (!string.IsNullOrWhiteSpace(request.Format))
        {
            if (Enum.TryParse<ReleaseFormat>(request.Format, true, out ReleaseFormat formatEnum))
            {
                query = query.Where(release => release.Versions.Any(variant => variant.Format == formatEnum));
            }
        }

        // 2. Count Total
        int totalCount = await query.CountAsync(ct);

        // 3. Paging and Sorting
        List<Release> items = await query
            .OrderByDescending(release => release.Year)
            .ThenBy(release => release.Title)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<Release?> GetWithDetailsAsync(Guid id, bool track = false, CancellationToken ct = default)
    {
        IQueryable<Release> query = _context.Set<Release>()
            .Include(release => release.Artist)
            .Include(release => release.ReleaseGenres)
                .ThenInclude(releaseGenre => releaseGenre.Genre)
            .Include(release => release.Tracks)
            .Include(release => release.Versions)
                .ThenInclude(releaseVersion => releaseVersion.Label)
            .Include(release => release.Versions)
                .ThenInclude(releaseVersion => releaseVersion.Products)
                    .ThenInclude(product => product.Variants)
            .AsQueryable();

        if (!track)
        {
            query = query.AsNoTracking();
        }

        return await query.FirstOrDefaultAsync(release => release.Id == id, ct);
    }

    public async Task<Release?> GetBySlugWithDetailsAsync(string slug, bool track = false, CancellationToken ct = default)
    {
        IQueryable<Release> query = _context.Set<Release>()
            .Include(release => release.Artist)
            .Include(release => release.ReleaseGenres)
                .ThenInclude(releaseGenre => releaseGenre.Genre)
            .Include(release => release.Tracks)
            .Include(release => release.Versions)
                .ThenInclude(releaseVersion => releaseVersion.Label)
            .Include(release => release.Versions)
                .ThenInclude(releaseVersion => releaseVersion.Products)
                    .ThenInclude(product => product.Variants)
            .AsQueryable();

        if (!track)
        {
            query = query.AsNoTracking();
        }

        return await query.FirstOrDefaultAsync(release => release.Slug == slug, ct);
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
