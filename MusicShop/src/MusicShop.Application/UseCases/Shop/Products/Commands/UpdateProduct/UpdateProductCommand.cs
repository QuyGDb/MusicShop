using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.UpdateProduct;

public sealed record UpdateProductCommand(
    Guid Id,
    string? Name,
    string? Slug,
    string? Description,
    bool? IsActive,
    bool? IsPreorder,
    DateTime? PreorderReleaseDate,
    int? LimitedQty) : IRequest<Result>;
