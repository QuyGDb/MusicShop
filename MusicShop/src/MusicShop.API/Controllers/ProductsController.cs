using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProductById;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProducts;

namespace MusicShop.API.Controllers;

public sealed class ProductsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProductListItemDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductListItemDto>>>> GetProducts([FromQuery] GetProductsQuery query)
    {
        var result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> GetProductById(Guid id)
    {
        var result = await mediator.Send(new GetProductByIdQuery(id));
        return HandleResult(result);
    }
}
