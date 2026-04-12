using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.AddProductToCollection;

public sealed record AddProductToCollectionCommand(
    Guid CollectionId,
    Guid ProductId,
    int? SortOrder) : IRequest<Result<Guid>>;
