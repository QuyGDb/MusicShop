using Microsoft.AspNetCore.Mvc;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.UseCases.Shop.Orders.Commands.UpdateOrderStatus;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;
using MediatR;

namespace MusicShop.Api.Controllers;

[ApiController]
[Route("api/v1/payments/stripe")]
public sealed class PaymentsController : ControllerBase
{
    private readonly IStripeService _stripeService;
    private readonly IMediator _mediator;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(
        IStripeService stripeService, 
        IMediator mediator, 
        ILogger<PaymentsController> logger)
    {
        _stripeService = stripeService;
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost("webhook")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"];

        var result = await _stripeService.HandleWebhookAsync(json, signature!);

        if (result.IsSuccess)
        {
            var orderId = Guid.Parse(result.Value);
            _logger.LogInformation("Payment successful for Order {OrderId}. Updating status.", orderId);

            // Update order status to Confirmed/Processing after successful payment
            // Note: In a real app, you might have a separate PaymentStatus update first.
            var updateResult = await _mediator.Send(new UpdateOrderStatusCommand(orderId, OrderStatus.Confirmed, null));

            if (!updateResult.IsSuccess)
            {
                _logger.LogError("Failed to update Order {OrderId} status: {Error}", orderId, updateResult.Error.Message);
                return BadRequest();
            }

            return Ok();
        }

        _logger.LogWarning("Stripe Webhook verification failed: {Error}", result.Error.Message);
        return BadRequest();
    }
}
