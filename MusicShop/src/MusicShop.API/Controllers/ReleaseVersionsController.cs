using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.CreateReleaseVersion;
using MusicShop.Application.UseCases.Catalog.ReleaseVersions.Queries.GetReleaseVersionsByRelease;
using MusicShop.API.Infrastructure;

namespace MusicShop.API.Controllers;

public class ReleaseVersionsController(IMediator mediator) : BaseApiController
{
    [HttpGet("by-release/{releaseId:guid}")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<Application.DTOs.Catalog.ReleaseVersionDto>>>> GetByRelease(Guid releaseId)
    {
        Domain.Common.Result<IReadOnlyList<Application.DTOs.Catalog.ReleaseVersionDto>> result = await mediator.Send(new GetReleaseVersionsByReleaseQuery(releaseId));
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ApiResponse<Application.DTOs.Catalog.ReleaseVersionDto>>> CreateReleaseVersion([FromBody] CreateReleaseVersionCommand command)
    {
        Domain.Common.Result<Application.DTOs.Catalog.ReleaseVersionDto> result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetByRelease), new { releaseId = command.ReleaseId });
    }
}
