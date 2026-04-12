using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Application.UseCases.Shop.Orders.Commands.CreateOrder;
using MusicShop.Domain.Common;

namespace MusicShop.API.Controllers;

    [Authorize]
    public sealed class OrdersController(IMediator mediator) : BaseApiController
    {
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
