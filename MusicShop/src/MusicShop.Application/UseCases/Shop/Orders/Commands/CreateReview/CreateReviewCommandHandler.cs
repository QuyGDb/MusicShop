using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Customer;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.CreateReview;

public sealed class CreateReviewCommandHandler(
    IOrderRepository orderRepository,
    IRepository<Review> reviewRepository,
    IUnitOfWork unitOfWork,
    ICurrentUserService currentUserService) : IRequestHandler<CreateReviewCommand, Result>
{
    public async Task<Result> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.GetByIdWithDetailsAsync(request.OrderId, cancellationToken);
        
        if (order == null) return Result.Failure(OrderErrors.NotFound);

        // Security check
        var userId = Guid.Parse(currentUserService.UserId!);
        if (order.CustomerId != userId) return Result.Failure(OrderErrors.NotFound);

        // State check: Must be delivered
        if (order.Status != OrderStatus.Delivered) return Result.Failure(ReviewErrors.OrderNotDelivered);

        // Item check: Product must be in order
        var hasProduct = order.OrderItems.Any(oi => oi.Variant.ProductId == request.ProductId);
        if (!hasProduct) return Result.Failure(ReviewErrors.ProductNotInOrder);

        // Duplicate check
        var existing = await reviewRepository.FirstOrDefaultAsync(
            r => r.OrderId == request.OrderId && r.ProductId == request.ProductId, 
            cancellationToken);
        
        if (existing != null) return Result.Failure(ReviewErrors.AlreadyReviewed);

        var review = new Review
        {
            OrderId = request.OrderId,
            UserId = userId,
            ProductId = request.ProductId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        reviewRepository.Add(review);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
