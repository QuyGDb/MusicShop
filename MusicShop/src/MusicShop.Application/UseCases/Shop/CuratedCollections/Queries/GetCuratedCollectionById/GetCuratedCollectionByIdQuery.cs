using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollectionById;

public sealed record GetCuratedCollectionByIdQuery(Guid Id) : IRequest<Result<CuratedCollectionDetailResponse>>;
