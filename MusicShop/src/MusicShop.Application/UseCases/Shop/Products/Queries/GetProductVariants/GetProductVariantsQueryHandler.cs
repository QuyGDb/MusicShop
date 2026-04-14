using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProductVariants;

public sealed class GetProductVariantsQueryHandler(
    IProductRepository productRepository) : IRequestHandler<GetProductVariantsQuery, Result<IReadOnlyList<ProductVariantDto>>>
{
    public async Task<Result<IReadOnlyList<ProductVariantDto>>> Handle(
        GetProductVariantsQuery request,
        CancellationToken cancellationToken)
    {
        bool exists = await productRepository.AnyAsync(product => product.Id == request.ProductId, cancellationToken);
        if (!exists)
        {
            return Result<IReadOnlyList<ProductVariantDto>>.Failure(ProductErrors.NotFound);
        }

        IReadOnlyList<ProductVariant> variants = await productRepository.GetVariantsAsync(request.ProductId, cancellationToken);

        IReadOnlyList<ProductVariantDto> productVariantDtos = variants.Select(variant => new ProductVariantDto
        {
            Id = variant.Id,
            VariantName = variant.VariantName,
            Price = variant.Price,
            StockQty = variant.StockQty,
            IsAvailable = variant.IsAvailable,
            IsSigned = variant.IsSigned
        }).ToList();

        return Result<IReadOnlyList<ProductVariantDto>>.Success(productVariantDtos);
    }
}
