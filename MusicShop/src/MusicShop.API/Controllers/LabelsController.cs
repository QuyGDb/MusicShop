using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.UseCases.Catalog.Labels.Queries.GetLabels;
using MusicShop.Application.UseCases.Catalog.Labels.Queries.GetLabelBySlug;
using MusicShop.Application.UseCases.Catalog.Labels.Commands.CreateLabel;
using MusicShop.Application.UseCases.Catalog.Labels.Commands.UpdateLabel;
using MusicShop.Application.UseCases.Catalog.Labels.Commands.DeleteLabel;
using MusicShop.API.Infrastructure;
using MusicShop.Domain.Common;

namespace MusicShop.API.Controllers;

public class LabelsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<LabelResponse>>>> GetLabels([FromQuery] GetLabelsQuery query)
    {
        var result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<LabelResponse>>> GetLabel(string slug)
    {
        var result = await mediator.Send(new GetLabelBySlugQuery(slug));
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<string>>> CreateLabel([FromBody] CreateLabelCommand command)
    {
        var result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetLabel), new { slug = result.Value });
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<string>>> UpdateLabel(Guid id, [FromBody] UpdateLabelRequest request)
    {
        var result = await mediator.Send(new UpdateLabelCommand(
            id, 
            request.Name, 
            request.Slug, 
            request.Country, 
            request.FoundedYear, 
            request.Website));

        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteLabel(Guid id)
    {
        Result result = await mediator.Send(new DeleteLabelCommand(id));
        return HandleNoContentResult(result);
    }
}
