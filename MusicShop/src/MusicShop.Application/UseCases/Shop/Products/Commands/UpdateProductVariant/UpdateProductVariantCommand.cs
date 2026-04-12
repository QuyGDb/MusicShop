using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.UpdateProductVariant;

public sealed record UpdateProductVariantCommand(
    Guid ProductId,
    Guid VariantId,
    string VariantName,
    decimal Price,
    int StockQty,
    bool IsSigned,
    bool IsAvailable,
    VinylAttributesDto? VinylAttributes,
    CdAttributesDto? CdAttributes,
    CassetteAttributesDto? CassetteAttributes) : IRequest<Result>;
