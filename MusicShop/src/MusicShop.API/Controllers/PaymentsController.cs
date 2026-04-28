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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Webhook()
    {
        using StreamReader reader = new StreamReader(Request.Body);
        string json = await reader.ReadToEndAsync();
        string? signature = Request.Headers["Stripe-Signature"];

        if (string.IsNullOrWhiteSpace(signature))
        {
            return BadRequest();
        }

        ProcessStripeWebhookCommand command = new ProcessStripeWebhookCommand(json, signature);
        Result result = await mediator.Send(command);

        return result.IsSuccess ? Ok() : BadRequest();
    }
}
