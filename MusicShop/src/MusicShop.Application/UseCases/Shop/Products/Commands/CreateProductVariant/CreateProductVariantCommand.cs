using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.CreateProductVariant;

public sealed record CreateProductVariantCommand(
    Guid ProductId,
    string VariantName,
    decimal Price,
    int StockQty,
    bool IsSigned,
    string? ImageUrl,
    VinylAttributesDto? VinylAttributes,
    CdAttributesDto? CdAttributes,
    CassetteAttributesDto? CassetteAttributes) : IRequest<Result<Guid>>;
