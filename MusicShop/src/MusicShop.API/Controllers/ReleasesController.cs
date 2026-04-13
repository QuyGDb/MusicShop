using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.UseCases.Catalog.Releases.Commands.CreateRelease;
using MusicShop.Application.UseCases.Catalog.Releases.Commands.DeleteRelease;
using MusicShop.Application.UseCases.Catalog.Releases.Commands.UpdateRelease;
using MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleaseById;
using MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleaseBySlug;
using MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleases;
using MusicShop.Domain.Common;

namespace MusicShop.API.Controllers;

public class ReleasesController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ReleaseResponse>>>> GetReleases([FromQuery] GetReleasesQuery query)
    {
        var result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<ReleaseDetailResponse>>> GetRelease(string slug)
    {
        var result = await mediator.Send(new GetReleaseBySlugQuery(slug));
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateRelease([FromBody] CreateReleaseCommand command)
    {
        var result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetRelease), new { slug = command.Slug });
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<Guid>>> UpdateRelease(Guid id, [FromBody] UpdateReleaseRequest request)
    {
        var result = await mediator.Send(new UpdateReleaseCommand(
            id, 
            request.Title, 
            request.Slug, 
            request.Year, 
            request.Type, 
            request.ArtistId, 
            request.CoverUrl, 
            request.Description, 
            request.GenreIds, 
            request.Tracks));

        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteRelease(Guid id)
    {
        Result result = await mediator.Send(new DeleteReleaseCommand(id));
        return HandleNoContentResult(result);
    }
}
