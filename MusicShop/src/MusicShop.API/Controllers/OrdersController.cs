using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
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
        
        // Return 201 Created with the order detail link (once the GET endpoint is implemented)
        // For now, using HandleResult giving 200/400
        return HandleResult(result);
    }
}
