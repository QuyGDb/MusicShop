using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Application.UseCases.Shop.Orders.Commands.CancelOrder;
using MusicShop.Application.UseCases.Shop.Orders.Commands.CreateOrder;
using MusicShop.Application.UseCases.Shop.Orders.Queries.GetOrderDetail;
using MusicShop.Application.UseCases.Shop.Orders.Queries.GetOrderHistory;
using MusicShop.Domain.Common;

namespace MusicShop.API.Controllers;

[Authorize]
public sealed class OrdersController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<OrderListItemDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<OrderListItemDto>>>> GetOrderHistory([FromQuery] GetOrderHistoryQuery query)
    {
        Result<PaginatedResult<OrderListItemDto>> result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<OrderDetailDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<OrderDetailDto>>> GetOrderDetail([FromRoute] Guid id)
    {
        Result<OrderDetailDto> result = await mediator.Send(new GetOrderDetailQuery(id));
        return HandleResult(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CreateOrderResponse>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<CreateOrderResponse>>> CreateOrder([FromBody] CreateOrderCommand command)
    {
        Result<CreateOrderResponse> result = await mediator.Send(command);
        return HandleResult(result);
    }

    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult<ApiResponse<object>>> CancelOrder([FromRoute] Guid id)
    {
        Result result = await mediator.Send(new CancelOrderCommand(id));
        return HandleNonGenericResult(result);
    }
}
