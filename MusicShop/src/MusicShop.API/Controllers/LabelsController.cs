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
    public async Task<ActionResult<ApiResponse<IReadOnlyList<Application.DTOs.Catalog.LabelResponse>>>> GetLabels(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] string? country = null)
    {
        GetLabelsQuery query = new GetLabelsQuery(pageNumber, pageSize, q, country);
        Domain.Common.Result<Application.Common.PaginatedResult<Application.DTOs.Catalog.LabelResponse>> result = await mediator.Send(query);

        return HandlePaginatedResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<MusicShop.Application.DTOs.Catalog.LabelResponse>>> GetLabel(Guid id)
    {
        GetLabelByIdQuery query = new GetLabelByIdQuery(id);
        MusicShop.Domain.Common.Result<MusicShop.Application.DTOs.Catalog.LabelResponse> result = await mediator.Send(query);

        return HandleResult(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Application.DTOs.Catalog.LabelResponse>>> CreateLabel([FromBody] CreateLabelCommand command)
    {
        Domain.Common.Result<Application.DTOs.Catalog.LabelResponse> result = await mediator.Send(command);

        return HandleCreatedResult(result, nameof(GetLabel), new { id = result.Value?.Id });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<Application.DTOs.Catalog.LabelResponse>>> UpdateLabel(Guid id, [FromBody] UpdateLabelCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(ApiResponse<object>.FailureResult("ID_MISMATCH", "Route id does not match the body id."));
        }

        Domain.Common.Result<Application.DTOs.Catalog.LabelResponse> result = await mediator.Send(command);

        return HandleResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteLabel(Guid id)
    {
        DeleteLabelCommand command = new DeleteLabelCommand(id);
        Domain.Common.Result<bool> result = await mediator.Send(command);

        return HandleNonGenericResult(result);
    }
}
