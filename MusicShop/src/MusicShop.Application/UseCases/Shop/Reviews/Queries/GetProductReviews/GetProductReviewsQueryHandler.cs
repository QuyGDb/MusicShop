using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Reviews.Queries.GetProductReviews;

public sealed class GetProductReviewsQueryHandler(
    IReviewRepository reviewRepository) : IRequestHandler<GetProductReviewsQuery, Result<PaginatedResult<ReviewDto>>>
{
    public async Task<Result<PaginatedResult<ReviewDto>>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await reviewRepository.GetPagedByProductIdAsync(
            request.ProductId,
            request.PageNumber,
            request.PageSize,
            cancellationToken);

        var dtos = items.Select(r => new ReviewDto(
            r.Id,
            r.UserId,
            r.User.FullName,
            r.Rating,
            r.Comment,
            r.CreatedAt
        )).ToList();

        return Result<PaginatedResult<ReviewDto>>.Success(
            new PaginatedResult<ReviewDto>(dtos, totalCount, request.PageNumber, request.PageSize));
    }
}
