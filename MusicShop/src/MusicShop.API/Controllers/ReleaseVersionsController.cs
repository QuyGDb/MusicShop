using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.CreateReleaseVersion;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.UpdateReleaseVersion;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.DeleteReleaseVersion;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Queries.GetReleaseVersionsByRelease;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.API.Infrastructure;
using MusicShop.Domain.Common;

namespace MusicShop.API.Controllers;

public class ReleaseVersionsController(IMediator mediator) : BaseApiController
{
    [HttpGet("by-release/{releaseId:guid}")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ReleaseVersionDto>>>> GetByRelease(Guid releaseId)
    {
        var result = await mediator.Send(new GetReleaseVersionsByReleaseQuery(releaseId));
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateReleaseVersion([FromBody] CreateReleaseVersionCommand command)
    {
        var result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetByRelease), new { releaseId = command.ReleaseId });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ApiResponse<Guid>>> UpdateReleaseVersion(Guid id, [FromBody] UpdateReleaseVersionCommand command)
    {
        if (id != command.Id) return BadRequest();
        var result = await mediator.Send(command);
        return HandleResult(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteReleaseVersion(Guid id)
    {
        Result result = await mediator.Send(new DeleteReleaseVersionCommand(id));
        return HandleNoContentResult(result);
    }
}
