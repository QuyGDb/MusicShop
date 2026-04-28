using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.Common.Models;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Payments.Commands.ProcessStripeWebhook;

public sealed class ProcessStripeWebhookCommandHandler(
    IStripeService stripeService,
    IRepository<ProcessedWebhookEvent> eventRepository,
    IMediator mediator) : IRequestHandler<ProcessStripeWebhookCommand, MusicShop.Domain.Common.Result>
{
    public async Task<Result> Handle(ProcessStripeWebhookCommand request, CancellationToken cancellationToken)
    {
        WebhookProcessResult result = await stripeService.HandleWebhookAsync(request.Json, request.Signature, cancellationToken);

        if (result.Status == WebhookProcessStatus.Ignored)
        {
            return Result.Success();
        }

        if (result.Status == WebhookProcessStatus.Error)
        {
            return Result.Failure(result.Error!);
        }

        // 1. Idempotency Check
        if (await eventRepository.AnyAsync(x => x.StripeEventId == result.StripeEventId, cancellationToken))
        {
            return Result.Success();
        }

        // 2. Mark as processed
        eventRepository.Add(new ProcessedWebhookEvent
        {
            StripeEventId = result.StripeEventId!,
            EventType = result.EventType!
        });

        // 3. Execute business logic
        return await mediator.Send(result.Command!, cancellationToken);
    }
}
