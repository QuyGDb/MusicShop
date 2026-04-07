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
    public async Task<IActionResult> GetArtists(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        GetArtistsQuery query = new GetArtistsQuery(pageNumber, pageSize);
        Domain.Common.Result<Application.Common.PaginatedResult<MusicShop.Application.DTOs.Catalog.ArtistResponse>> result = await mediator.Send(query);

        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetArtist(Guid id)
    {
        GetArtistByIdQuery query = new GetArtistByIdQuery(id);
        Domain.Common.Result<Application.DTOs.Catalog.ArtistResponse> result = await mediator.Send(query);

        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateArtist([FromBody] CreateArtistCommand command)
    {
        MusicShop.Domain.Common.Result<MusicShop.Application.DTOs.Catalog.ArtistResponse> result = await mediator.Send(command);

        // For Create, if successful, we return 201 Created and the wrapped object
        return result.Match(
            value => CreatedAtAction(nameof(GetArtist), new { id = value.Id }, ApiResponse<object>.SuccessResult(value)),
            error => HandleResult(result) // This will properly map the failure
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateArtist(Guid id, [FromBody] UpdateArtistCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(ApiResponse<object>.FailureResult("ID_MISMATCH", "Route id does not match the body id."));
        }

        MusicShop.Domain.Common.Result<MusicShop.Application.DTOs.Catalog.ArtistResponse> result = await mediator.Send(command);

        return HandleResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteArtist(Guid id)
    {
        DeleteArtistCommand command = new DeleteArtistCommand(id);
        MusicShop.Domain.Common.Result<bool> result = await mediator.Send(command);

        return result.Match(
            _ => Ok(ApiResponse<object>.SuccessResult(null!)),
            _ => HandleResult(result)
        );
    }
}
