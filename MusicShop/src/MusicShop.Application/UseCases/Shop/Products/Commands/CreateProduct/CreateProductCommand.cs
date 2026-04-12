using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.CreateProduct;

public sealed record CreateProductCommand(
    Guid ReleaseVersionId,
    string Name,
    string Slug,
    string? Description,
    string? CoverUrl,
    ReleaseFormat Format,
    bool IsLimited,
    int? LimitedQty,
    bool IsPreorder,
    DateTime? PreorderReleaseDate) : IRequest<Result<Guid>>;
