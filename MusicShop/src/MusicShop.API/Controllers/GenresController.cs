using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.Application.UseCases.Catalog.Genres.Commands.CreateGenre;
using MusicShop.Application.UseCases.Catalog.Genres.Queries.GetGenres;
using MusicShop.API.Infrastructure;

namespace MusicShop.API.Controllers;

public class GenresController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<Application.DTOs.Catalog.GenreResponse>>>> GetGenres()
    {
        Domain.Common.Result<IReadOnlyList<Application.DTOs.Catalog.GenreResponse>> result = await mediator.Send(new GetGenresQuery());
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ApiResponse<Application.DTOs.Catalog.GenreResponse>>> CreateGenre([FromBody] CreateGenreCommand command)
    {
        Domain.Common.Result<Application.DTOs.Catalog.GenreResponse> result = await mediator.Send(command);
        return HandleResult(result);
    }
}
