using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.Common;
using MusicShop.Domain.Common;

namespace MusicShop.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected ActionResult<ApiResponse<T>> HandleResult<T>(Result<T> result)
    {
        if (result.IsFailure) return MapError(result.Error);

        return Ok(ApiResponse<T>.SuccessResult(result.Value));
    }

    protected ActionResult<ApiResponse<object>> HandleNonGenericResult(Result result)
    {
        if (result.IsFailure) return MapError(result.Error);

        return Ok(ApiResponse<object>.SuccessResult(null!));
    }

    protected ActionResult<ApiResponse<IReadOnlyList<T>>> HandlePaginatedResult<T>(Result<PaginatedResult<T>> result)
    {
        if (result.IsFailure) return MapError(result.Error);

        MetaData meta = new MetaData
        {
            Page = result.Value.PageNumber,
            Limit = result.Value.PageSize,
            Total = result.Value.TotalCount
        };

        return Ok(ApiResponse<IReadOnlyList<T>>.SuccessResult(result.Value.Items, meta));
    }

    protected ActionResult<ApiResponse<T>> HandleCreatedResult<T>(Result<T> result, string actionName, object routeValues)
    {
        if (result.IsFailure) return MapError(result.Error);

        return CreatedAtAction(actionName, routeValues, ApiResponse<T>.SuccessResult(result.Value));
    }

    protected ActionResult MapError(Error error)
    {
        ApiResponse<object> response = ApiResponse<object>.FailureResult(error.Code, error.Message);

        return error.Code switch
        {
            string code when code.EndsWith(".NotFound") => NotFound(response),
            string code when code.EndsWith(".Unauthorized") => Unauthorized(response),
            string code when code.EndsWith(".Forbidden") => Forbid(),
            string code when code.EndsWith(".Conflict") => Conflict(response),
            _ => BadRequest(response)
        };
    }
}
