using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.UseCases.Catalog.Releases.Commands.CreateRelease;
using MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleaseById;
using MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleases;
using MusicShop.Domain.Common;
using MusicShop.API.Infrastructure;

namespace MusicShop.API.Controllers;

public class ReleasesController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ReleaseResponse>>>> GetReleases(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] Guid? artistId = null,
        [FromQuery] string? genre = null,
        [FromQuery] int? year = null,
        [FromQuery] string? q = null)
    {
        GetReleasesQuery query = new GetReleasesQuery(pageNumber, pageSize, artistId, genre, year, q);
        Result<PaginatedResult<ReleaseResponse>> result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ReleaseDetailResponse>>> GetRelease(Guid id)
    {
        Result<ReleaseDetailResponse> result = await mediator.Send(new GetReleaseByIdQuery(id));
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ApiResponse<ReleaseResponse>>> CreateRelease([FromBody] CreateReleaseCommand command)
    {
        Result<ReleaseResponse> result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetRelease), new { id = result.Value.Id });
    }
}
