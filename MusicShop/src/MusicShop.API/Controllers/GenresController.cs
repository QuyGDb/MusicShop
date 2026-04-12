using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.UseCases.Catalog.Genres.Queries.GetGenres;
using MusicShop.Application.UseCases.Catalog.Genres.Queries.GetGenreBySlug;
using MusicShop.Application.UseCases.Catalog.Genres.Commands.CreateGenre;
using MusicShop.Application.UseCases.Catalog.Genres.Commands.DeleteGenre;
using MusicShop.Application.UseCases.Catalog.Genres.Commands.UpdateGenre;
using MusicShop.API.Infrastructure;

namespace MusicShop.API.Controllers;

public class GenresController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<GenreResponse>>>> GetGenres([FromQuery] GetGenresQuery query)
    {
        var result = await mediator.Send(query);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<GenreResponse>>> GetGenre(string slug)
    {
        var result = await mediator.Send(new GetGenreBySlugQuery(slug));
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<string>>> CreateGenre([FromBody] CreateGenreCommand command)
    {
        var result = await mediator.Send(command);
        return HandleCreatedResult(result, nameof(GetGenre), new { slug = result.Value });
    }


    [Authorize(Roles = "admin")]
    [HttpPut("{slug}")]
    [ProducesResponseType(typeof(ApiResponse<GenreResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<GenreResponse>>> UpdateGenre(string slug, [FromBody] UpdateGenreRequest request)
    {
        var result = await mediator.Send(new UpdateGenreCommand(slug, request.Name));
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{slug}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteGenre(string slug)
    {
        var result = await mediator.Send(new DeleteGenreCommand(slug));
        return HandleNonGenericResult(result);
    }
}

public record UpdateGenreRequest(string Name);
