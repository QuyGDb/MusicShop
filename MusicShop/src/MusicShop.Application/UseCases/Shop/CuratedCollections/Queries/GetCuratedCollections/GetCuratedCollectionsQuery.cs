using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollections;

public sealed record GetCuratedCollectionsQuery(
    bool IncludeUnpublished = false,
    int PageNumber = 1,
    int PageSize = 10,
    string? SearchQuery = null) : IRequest<Result<PaginatedResult<CuratedCollectionResponse>>>;
