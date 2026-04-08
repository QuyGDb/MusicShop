using Microsoft.AspNetCore.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.DeleteArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.UpdateArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtistById;
using MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtists;

namespace MusicShop.API.Controllers;

public class ArtistsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<MusicShop.Application.DTOs.Catalog.ArtistResponse>>>> GetArtists(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        GetArtistsQuery query = new GetArtistsQuery(pageNumber, pageSize);
        Domain.Common.Result<Application.Common.PaginatedResult<Application.DTOs.Catalog.ArtistResponse>> result = await mediator.Send(query);

        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<MusicShop.Application.DTOs.Catalog.ArtistResponse>>> GetArtist(Guid id)
    {
        GetArtistByIdQuery query = new GetArtistByIdQuery(id);
        Domain.Common.Result<Application.DTOs.Catalog.ArtistResponse> result = await mediator.Send(query);

        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<MusicShop.Application.DTOs.Catalog.ArtistResponse>>> CreateArtist([FromBody] CreateArtistCommand command)
    {
        MusicShop.Domain.Common.Result<MusicShop.Application.DTOs.Catalog.ArtistResponse> result = await mediator.Send(command);

        return HandleCreatedResult(result, nameof(GetArtist), new { id = result.Value?.Id });
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<MusicShop.Application.DTOs.Catalog.ArtistResponse>>> UpdateArtist(Guid id, [FromBody] UpdateArtistCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(ApiResponse<object>.FailureResult("ID_MISMATCH", "Route id does not match the body id."));
        }

        MusicShop.Domain.Common.Result<MusicShop.Application.DTOs.Catalog.ArtistResponse> result = await mediator.Send(command);

        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteArtist(Guid id)
    {
        DeleteArtistCommand command = new DeleteArtistCommand(id);
        MusicShop.Domain.Common.Result<bool> result = await mediator.Send(command);

        return HandleNonGenericResult(result);
    }
}
