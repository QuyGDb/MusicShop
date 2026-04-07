using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtists;

public sealed class GetArtistsQueryHandler(IArtistRepository artistRepository)
    : IRequestHandler<GetArtistsQuery, Result<PaginatedResult<ArtistResponse>>>
{
    public async Task<Result<PaginatedResult<ArtistResponse>>> Handle(
        GetArtistsQuery request,
        CancellationToken cancellationToken)
    {
        // 1. Call GetPagedWithGenresAsync from Infrastructure layer
        (IReadOnlyList<Artist> items, int totalCount) = await artistRepository.GetPagedWithGenresAsync(
            request.PageNumber,
            request.PageSize,
            cancellationToken);

        // 2. Map Entity to DTO
        List<ArtistResponse> artistResponses = items.Select(artist => new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Genres = artist.ArtistGenres.Select(ag => new GenreResponse
            {
                Id = ag.GenreId,
                Name = ag.Genre?.Name ?? string.Empty,
                Slug = ag.Genre?.Slug ?? string.Empty
            }).ToList(),
            Country = artist.Country,
            ImageUrl = artist.ImageUrl
        }).ToList();

        // 3. Wrap result into PaginatedResult
        PaginatedResult<ArtistResponse> result = new PaginatedResult<ArtistResponse>(
            artistResponses,
            totalCount,
            request.PageNumber,
            request.PageSize);

        return Result<PaginatedResult<ArtistResponse>>.Success(result);
    }
}
