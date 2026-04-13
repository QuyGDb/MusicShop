using Microsoft.AspNetCore.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.DeleteArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.UpdateArtist;
using MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtistBySlug;
using MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtists;
using MusicShop.Domain.Common;
using MusicShop.Application.Common;

namespace MusicShop.API.Controllers;

public class ArtistsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ArtistResponse>>>> GetArtists([FromQuery] GetArtistsQuery query)
    {
        Result<PaginatedResult<ArtistResponse>> result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<ArtistResponse>>> GetArtist(string slug)
    {
        Result<ArtistResponse> result = await mediator.Send(new GetArtistBySlugQuery(slug));
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<string>>> CreateArtist([FromBody] CreateArtistCommand command)
    {
        Result<string> result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetArtist), new { slug = result.Value });
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateArtist(Guid id, [FromBody] UpdateArtistRequest request)
    {
        Result<string> result = await mediator.Send(new UpdateArtistCommand(
            id,
            request.Name,
            request.Slug,
            request.Bio,
            request.Country,
            request.ImageUrl,
            request.GenreIds));

        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteArtist(Guid id)
    {
        Result result = await mediator.Send(new DeleteArtistCommand(id));
        return HandleNoContentResult(result);
    }
}
