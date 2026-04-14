using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.Common.Mappings;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProductBySlug;

public sealed class GetProductBySlugQueryHandler(IProductRepository productRepository)
    : IRequestHandler<GetProductBySlugQuery, Result<ProductDetailDto>>
{
    public async Task<Result<ProductDetailDto>> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
    {
        Domain.Entities.Shop.Product? product = await productRepository.GetBySlugWithDetailsAsync(request.Slug, cancellationToken);

        if (product == null)
        {
            return Result<ProductDetailDto>.Failure(ProductErrors.NotFound);
        }

        // Manual mapping from Entity to DTO using ProjectToDetailDto extensions
        ProductDetailDto productDetailDto = new[] { product }.AsQueryable().ProjectToDetailDto().First();

        return Result<ProductDetailDto>.Success(productDetailDto);
    }
}
