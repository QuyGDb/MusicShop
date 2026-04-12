using MediatR;
using MusicShop.Application.Common;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Reviews.Queries.GetProductReviews;

public sealed record GetProductReviewsQuery(
    Guid ProductId,
    int PageNumber = 1,
    int PageSize = 10) : IRequest<Result<PaginatedResult<ReviewDto>>>;

public sealed record ReviewDto(
    Guid Id,
    Guid UserId,
    string? UserName, // To be filled by handler if possible
    int Rating,
    string? Comment,
    DateTime CreatedAt);
