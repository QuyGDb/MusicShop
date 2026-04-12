using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.CreateCuratedCollection;

public sealed record CreateCuratedCollectionCommand(
    string Title,
    string? Description) : IRequest<Result<Guid>>;
