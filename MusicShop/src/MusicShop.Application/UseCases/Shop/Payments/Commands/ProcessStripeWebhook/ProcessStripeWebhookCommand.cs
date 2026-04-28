using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Payments.Commands.ProcessStripeWebhook;

public sealed record ProcessStripeWebhookCommand(
    string Json,
    string Signature) : IRequest<Result>;
