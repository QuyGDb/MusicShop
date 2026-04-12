using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Controllers;
using MusicShop.API.Infrastructure;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Application.UseCases.Shop.Cart.Commands.AddToCart;
using MusicShop.Application.UseCases.Shop.Cart.Commands.RemoveFromCart;
using MusicShop.Application.UseCases.Shop.Cart.Commands.UpdateCartItem;
using MusicShop.Application.UseCases.Shop.Cart.Queries.GetCart;

namespace MusicShop.API.Controllers;

[Authorize]
public sealed class CartController(
    IMediator mediator,
    ICurrentUserService currentUserService) : BaseApiController
{
    private Guid GetUserId() => Guid.Parse(currentUserService.UserId!);

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<CartDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<CartDto>>> GetCart()
    {
        var result = await mediator.Send(new GetCartQuery(GetUserId()));
        return HandleResult(result);
    }

    [HttpPost("items")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<Guid>>> AddToCart([FromBody] AddToCartRequest request)
    {
        var result = await mediator.Send(new AddToCartCommand(
            GetUserId(),
            request.ProductVariantId,
            request.Quantity));
            
        return HandleResult(result);
    }

    [HttpPut("items/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateCartItem(Guid id, [FromBody] UpdateCartItemRequest request)
    {
        var result = await mediator.Send(new UpdateCartItemCommand(
            GetUserId(),
            id,
            request.Quantity));
            
        return HandleNonGenericResult(result);
    }

    [HttpDelete("items/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status204NoContent)]
    public async Task<ActionResult<ApiResponse<object>>> RemoveFromCart(Guid id)
    {
        var result = await mediator.Send(new RemoveFromCartCommand(GetUserId(), id));
        return HandleNonGenericResult(result);
    }
}

public sealed record AddToCartRequest(Guid ProductVariantId, int Quantity);
public sealed record UpdateCartItemRequest(int Quantity);
