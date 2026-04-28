using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.UpdateCuratedCollectionStatus;

public sealed record UpdateCuratedCollectionStatusCommand(Guid Id, bool IsPublished) : IRequest<Result<Unit>>;
