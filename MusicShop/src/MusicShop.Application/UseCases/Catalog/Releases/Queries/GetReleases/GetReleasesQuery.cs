using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleases;

public record GetReleasesQuery(
    string? Q = null,
    Guid? ArtistId = null,
    Guid? GenreId = null,
    string? Format = null,
    int PageNumber = 1,
    int PageSize = 20) : IRequest<Result<PaginatedResult<ReleaseResponse>>>;
