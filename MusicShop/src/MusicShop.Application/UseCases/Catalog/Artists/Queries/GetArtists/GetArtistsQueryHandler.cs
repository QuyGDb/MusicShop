using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtists;

public sealed class GetArtistsQueryHandler(
    IArtistRepository artistRepository,
    IMapper mapper)
    : IRequestHandler<GetArtistsQuery, Result<PaginatedResult<ArtistResponse>>>
{
    public async Task<Result<PaginatedResult<ArtistResponse>>> Handle(
        GetArtistsQuery request,
        CancellationToken cancellationToken)
    {
        var query = artistRepository.AsQueryable();

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
        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(a => a.Name)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ProjectTo<ArtistResponse>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        // 3. Wrap result
        var result = new PaginatedResult<ArtistResponse>(
            items,
            totalCount,
            request.PageNumber,
            request.PageSize);

        return Result<PaginatedResult<ArtistResponse>>.Success(result);
    }
}
