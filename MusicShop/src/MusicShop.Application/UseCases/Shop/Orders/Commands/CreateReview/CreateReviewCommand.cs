using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.CreateReview;

public sealed record CreateReviewCommand(
    Guid OrderId,
    Guid ProductId,
    int Rating,
    string? Comment) : IRequest<Result>;
