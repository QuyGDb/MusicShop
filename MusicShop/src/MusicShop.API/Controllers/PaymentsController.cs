using Microsoft.AspNetCore.Mvc;
using MusicShop.Application.UseCases.Shop.Payments.Commands.ProcessStripeWebhook;
using MusicShop.Domain.Common;
using MediatR;

namespace MusicShop.Api.Controllers;

[ApiController]
[Route("api/v1/payments/stripe")]
public sealed class PaymentsController(IMediator mediator) : ControllerBase
{
    [HttpPost("webhook")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Webhook([FromServices] ILogger<PaymentsController> logger)
    {
        Request.EnableBuffering();
        using StreamReader reader = new StreamReader(Request.Body);
        string json = await reader.ReadToEndAsync();
        string? signature = Request.Headers["Stripe-Signature"];

        if (string.IsNullOrWhiteSpace(signature))
        {
            return BadRequest("Missing Stripe-Signature header");
        }

        ProcessStripeWebhookCommand command = new ProcessStripeWebhookCommand(json, signature);
        Result result = await mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error.Message);
        }

        return Ok();
    }
}
