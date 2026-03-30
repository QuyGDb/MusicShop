using Microsoft.AspNetCore.Mvc;
using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Application.UseCases.Auth.Commands.Register;
using MusicShop.Application.UseCases.Auth.Queries.Login;

namespace MusicShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    // Inject IMediator to route requests to the application layer
    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        // Route the command to RegisterCommandHandler
        AuthResponse result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginQuery query)
    {
        // Route the query to LoginQueryHandler
        AuthResponse result = await _mediator.Send(query);
        return Ok(result);
    }
}
