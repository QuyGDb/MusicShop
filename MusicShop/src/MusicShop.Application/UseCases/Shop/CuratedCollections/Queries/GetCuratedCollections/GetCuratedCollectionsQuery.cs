using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollections;

public sealed record GetCuratedCollectionsQuery : IRequest<Result<IReadOnlyList<CuratedCollectionResponse>>>;
