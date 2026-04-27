using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollections;

public sealed record GetCuratedCollectionsQuery(bool IncludeUnpublished = false) : IRequest<Result<IReadOnlyList<CuratedCollectionResponse>>>;
