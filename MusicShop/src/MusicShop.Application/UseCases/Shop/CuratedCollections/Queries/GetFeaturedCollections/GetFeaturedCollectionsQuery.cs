using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetFeaturedCollections;

public sealed record GetFeaturedCollectionsQuery(int Count = 3) : IRequest<Result<IReadOnlyList<CuratedCollectionFeaturedResponse>>>;
