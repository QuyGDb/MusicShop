using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.Common.Mappings;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProductById;

/// <summary>
/// Handler for GetProductByIdQuery. Uses IProductRepository.
/// </summary>
public sealed class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, Result<ProductDetailDto>>
{
    private readonly IProductRepository _productRepository;

    public GetProductByIdQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Result<ProductDetailDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken);

        if (product == null)
        {
            return Result<ProductDetailDto>.Failure(new Error("Product.NotFound", "The requested product was not found or is inactive."));
        }

        // Manual mapping from Entity to DTO
        var detailDto = new[] { product }.AsQueryable().ProjectToDetailDto().First();

        return Result<ProductDetailDto>.Success(detailDto);
    }
}
