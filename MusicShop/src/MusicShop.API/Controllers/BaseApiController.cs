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

    protected IActionResult HandleNoContentResult(Result result)
    {
        if (result.IsFailure) return MapError(result.Error);

        return NoContent();
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
        int statusCode = error.Code switch
        {
            string code when code.EndsWith(".NotFound") => StatusCodes.Status404NotFound,
            string code when code.EndsWith(".Unauthorized") => StatusCodes.Status401Unauthorized,
            string code when code.EndsWith(".Forbidden") => StatusCodes.Status403Forbidden,
            string code when code.EndsWith(".Conflict") => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status400BadRequest
        };

        return Problem(
            statusCode: statusCode,
            title: error.Code,
            detail: error.Message,
            type: GetErrorType(statusCode)
        );
    }

    private static string GetErrorType(int statusCode) => statusCode switch
    {
        StatusCodes.Status404NotFound => "https://tools.ietf.org/html/rfc7231#section-6.5.4",
        StatusCodes.Status409Conflict => "https://tools.ietf.org/html/rfc7231#section-6.5.11",
        _ => "https://tools.ietf.org/html/rfc7231#section-6.5.1"
    };
}
