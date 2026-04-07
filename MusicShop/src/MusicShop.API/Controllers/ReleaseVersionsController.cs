using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.CreateReleaseVersion;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Queries.GetReleaseVersionsByRelease;

namespace MusicShop.API.Controllers;

public class ReleaseVersionsController(IMediator mediator) : BaseApiController
{
    [HttpGet("by-release/{releaseId:guid}")]
    public async Task<IActionResult> GetByRelease(Guid releaseId)
    {
        var result = await mediator.Send(new GetReleaseVersionsByReleaseQuery(releaseId));
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreateReleaseVersion([FromBody] CreateReleaseVersionCommand command)
    {
        var result = await mediator.Send(command);
        return HandleResult(result);
    }
}
