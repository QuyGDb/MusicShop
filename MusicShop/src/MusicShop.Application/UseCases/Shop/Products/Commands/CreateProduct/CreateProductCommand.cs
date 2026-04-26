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
    bool IsLimited,
    int? LimitedQty,
    bool IsPreorder,
    DateTime? PreorderReleaseDate,
    decimal Price,
    int StockQty,
    bool IsSigned,
    DTOs.Shop.VinylAttributesDto? VinylAttributes = null,
    DTOs.Shop.CdAttributesDto? CdAttributes = null,
    DTOs.Shop.CassetteAttributesDto? CassetteAttributes = null) : IRequest<Result<Guid>>;
