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
public sealed class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, Result<PaginatedResult<ProductListItemDto>>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Result<PaginatedResult<ProductListItemDto>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _productRepository.GetPagedAsync(request, cancellationToken);

        var dtos = items.AsQueryable().ProjectToListItemDto().ToList();

        var paginatedResult = new PaginatedResult<ProductListItemDto>(
            dtos,
            totalCount,
            request.Page,
            request.Limit);

        return Result<PaginatedResult<ProductListItemDto>>.Success(paginatedResult);
    }
}
