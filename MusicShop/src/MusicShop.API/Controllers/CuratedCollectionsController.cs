using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollectionById;
using MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollections;

namespace MusicShop.API.Controllers;

public sealed class CuratedCollectionsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CuratedCollectionResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CuratedCollectionResponse>>>> GetCuratedCollections()
    {
        var result = await mediator.Send(new GetCuratedCollectionsQuery());
        return HandleResult(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CuratedCollectionDetailResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<CuratedCollectionDetailResponse>>> GetCuratedCollectionById([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetCuratedCollectionByIdQuery(id));
        return HandleResult(result);
    }
}
