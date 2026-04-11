using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Genres.Queries.GetGenres;

public record GetGenresQuery(
    string? Q = null,
    int PageNumber = 1, 
    int PageSize = 20) : IRequest<Result<PaginatedResult<GenreResponse>>>;
