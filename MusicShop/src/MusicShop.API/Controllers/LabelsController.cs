using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.UseCases.Catalog.Labels.Commands.CreateLabel;
using MusicShop.Application.UseCases.Catalog.Labels.Commands.DeleteLabel;
using MusicShop.Application.UseCases.Catalog.Labels.Commands.UpdateLabel;
using MusicShop.Application.UseCases.Catalog.Labels.Queries.GetLabelById;
using MusicShop.Application.UseCases.Catalog.Labels.Queries.GetLabels;

namespace MusicShop.API.Controllers;

public class LabelsController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetLabels(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] string? country = null)
    {
        var query = new GetLabelsQuery(pageNumber, pageSize, q, country);
        var result = await mediator.Send(query);

        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetLabel(Guid id)
    {
        var query = new GetLabelByIdQuery(id);
        var result = await mediator.Send(query);

        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLabel([FromBody] CreateLabelCommand command)
    {
        var result = await mediator.Send(command);

        return result.Match(
            value => CreatedAtAction(nameof(GetLabel), new { id = value.Id }, ApiResponse<object>.SuccessResult(value)),
            error => HandleResult(result)
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateLabel(Guid id, [FromBody] UpdateLabelCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(ApiResponse<object>.FailureResult("ID_MISMATCH", "Route id does not match the body id."));
        }

        var result = await mediator.Send(command);

        return HandleResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteLabel(Guid id)
    {
        var command = new DeleteLabelCommand(id);
        var result = await mediator.Send(command);

        return result.Match(
            _ => Ok(ApiResponse<object>.SuccessResult(null!)),
            _ => HandleResult(result)
        );
    }
}
