using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollectionById;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollections;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.CreateCuratedCollection;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.UpdateCuratedCollection;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.AddProductToCollection;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.RemoveProductFromCollection;
using Microsoft.AspNetCore.Authorization;

namespace MusicShop.API.Controllers;

public sealed class CuratedCollectionsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CuratedCollectionResponse>>>> GetCuratedCollections()
    {
        var result = await mediator.Send(new GetCuratedCollectionsQuery());
        return HandleResult(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CuratedCollectionDetailResponse>>> GetCuratedCollectionById([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetCuratedCollectionByIdQuery(id));
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateCuratedCollection([FromBody] CreateCuratedCollectionCommand command)
    {
        var result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetCuratedCollectionById), id => new { id });
    }

    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<Guid>>> UpdateCuratedCollection([FromRoute] Guid id, [FromBody] UpdateCuratedCollectionRequest request)
    {
        var result = await mediator.Send(new UpdateCuratedCollectionCommand(id, request.Title, request.Description, request.IsPublished));
        return HandleResult(result);
    }

    [HttpPost("{id:guid}/items")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<Guid>>> AddProductToCollection([FromRoute] Guid id, [FromBody] AddProductToCollectionRequest request)
    {
        var result = await mediator.Send(new AddProductToCollectionCommand(id, request.ProductId, request.SortOrder));
        return HandleResult(result);
    }

    [HttpDelete("{id:guid}/items/{productId:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<Unit>>> RemoveProductFromCollection([FromRoute] Guid id, [FromRoute] Guid productId)
    {
        var result = await mediator.Send(new RemoveProductFromCollectionCommand(id, productId));
        return HandleResult(result);
    }
}
