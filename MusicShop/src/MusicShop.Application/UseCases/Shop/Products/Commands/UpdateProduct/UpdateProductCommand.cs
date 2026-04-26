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
    int? LimitedQty,
    decimal? Price,
    int? StockQty,
    bool? IsSigned,
    DTOs.Shop.VinylAttributesDto? VinylAttributes = null,
    DTOs.Shop.CdAttributesDto? CdAttributes = null,
    DTOs.Shop.CassetteAttributesDto? CassetteAttributes = null) : IRequest<Result>;
