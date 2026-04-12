using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.RemoveProductFromCollection;

public sealed record RemoveProductFromCollectionCommand(
    Guid CollectionId,
    Guid ProductId) : IRequest<Result<Unit>>;
