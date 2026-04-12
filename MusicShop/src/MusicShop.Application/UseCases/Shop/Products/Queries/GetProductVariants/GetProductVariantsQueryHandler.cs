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
        bool exists = await productRepository.AnyAsync(p => p.Id == request.ProductId, cancellationToken);
        if (!exists)
        {
            return Result<IReadOnlyList<ProductVariantDto>>.Failure(ProductErrors.NotFound);
        }

        IReadOnlyList<ProductVariant> variants = await productRepository.GetVariantsAsync(request.ProductId, cancellationToken);

        IReadOnlyList<ProductVariantDto> dtos = variants.Select(v => new ProductVariantDto
        {
            Id = v.Id,
            VariantName = v.VariantName,
            Price = v.Price,
            StockQty = v.StockQty,
            IsAvailable = v.IsAvailable,
            IsSigned = v.IsSigned
        }).ToList();

        return Result<IReadOnlyList<ProductVariantDto>>.Success(dtos);
    }
}
