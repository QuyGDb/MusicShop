using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.DeleteCuratedCollection;

public sealed record DeleteCuratedCollectionCommand(Guid Id) : IRequest<Result<Unit>>;
