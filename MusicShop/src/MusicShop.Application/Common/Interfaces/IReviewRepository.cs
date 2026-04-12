using MusicShop.Application.Common;
using MusicShop.Domain.Entities.Customer;

namespace MusicShop.Application.Common.Interfaces;

public interface IReviewRepository
{
    Task<(IReadOnlyList<Review> Items, int TotalCount)> GetPagedByProductIdAsync(
        Guid productId,
        int page,
        int limit,
        CancellationToken ct = default);
}
