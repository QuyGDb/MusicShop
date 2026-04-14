using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.Common.Mappings;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProducts;

/// <summary>
/// Handler for GetProductsQuery. Uses IProductRepository.
/// </summary>
public sealed class GetProductsQueryHandler(IProductRepository productRepository) : IRequestHandler<GetProductsQuery, Result<PaginatedResult<ProductListItemDto>>>
{
    public async Task<Result<PaginatedResult<ProductListItemDto>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        (IReadOnlyList<Product> products, int totalCount) = await productRepository.GetPagedAsync(request, cancellationToken);

        List<ProductListItemDto> productListItemDtos = products.AsQueryable().ProjectToListItemDto().ToList();

        PaginatedResult<ProductListItemDto> paginatedResult = new PaginatedResult<ProductListItemDto>(
            productListItemDtos,
            totalCount,
            request.Page,
            request.Limit);

        return Result<PaginatedResult<ProductListItemDto>>.Success(paginatedResult);
    }
}
