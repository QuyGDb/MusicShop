using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.UpdateCuratedCollection;

public sealed record UpdateCuratedCollectionCommand(
    Guid Id,
    string? Title,
    string? Description,
    bool? IsPublished) : IRequest<Result<Guid>>;
