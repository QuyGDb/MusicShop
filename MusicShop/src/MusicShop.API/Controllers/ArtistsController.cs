using Microsoft.AspNetCore.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.DeleteArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.UpdateArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtistById;
using MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtists;

namespace MusicShop.API.Controllers;

public class ArtistsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ArtistResponse>>>> GetArtists([FromQuery] GetArtistsQuery query)
    {
        var result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ArtistResponse>>> GetArtist(Guid id)
    {
        var result = await mediator.Send(new GetArtistByIdQuery(id));
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateArtist([FromBody] CreateArtistCommand command)
    {
        var result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetArtist), new { id = result.Value });
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<Guid>>> UpdateArtist(Guid id, [FromBody] UpdateArtistCommand command)
    {
        if (id != command.Id) return BadRequest();

        var result = await mediator.Send(command);
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteArtist(Guid id)
    {
        var result = await mediator.Send(new DeleteArtistCommand(id));
        return HandleNonGenericResult(result);
    }
}
