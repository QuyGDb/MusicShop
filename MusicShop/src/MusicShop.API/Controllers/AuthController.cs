using Microsoft.AspNetCore.Mvc;
using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Application.UseCases.Auth.Commands.TokenRefresh;
using MusicShop.Application.UseCases.Auth.Commands.Register;
using MusicShop.Application.UseCases.Auth.Queries.Login;
using MusicShop.API.Infrastructure;

namespace MusicShop.API.Controllers;

public class AuthController(IMediator mediator) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterCommand command)
    {
        Domain.Common.Result<AuthResponse> result = await mediator.Send(command);
        return HandleResult(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginQuery query)
    {
        Domain.Common.Result<AuthResponse> result = await mediator.Send(query);
        return HandleResult(result);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> RefreshToken([FromBody] RefreshTokenCommand command)
    {
        Domain.Common.Result<AuthResponse> result = await mediator.Send(command);
        return HandleResult(result);
    }
}
