using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Orders.Queries.GetOrderHistory;

public sealed class GetOrderHistoryQueryHandler(
    IOrderRepository orderRepository,
    ICurrentUserService currentUserService) : IRequestHandler<GetOrderHistoryQuery, Result<PaginatedResult<OrderListItemDto>>>
{
    public async Task<Result<PaginatedResult<OrderListItemDto>>> Handle(GetOrderHistoryQuery request, CancellationToken cancellationToken)
    {
        Guid userId = Guid.Parse(currentUserService.UserId!);

        var (orders, totalCount) = await orderRepository.GetPagedByUserIdAsync(
            userId, 
            request.Status, 
            request.Page, 
            request.Limit, 
            cancellationToken);

        var dtos = orders.Select(o => new OrderListItemDto(
            o.Id,
            o.Status,
            o.TotalAmount,
            o.CreatedAt,
            o.OrderItems.Count
        )).ToList();

        return Result<PaginatedResult<OrderListItemDto>>.Success(
            new PaginatedResult<OrderListItemDto>(dtos, totalCount, request.Page, request.Limit));
    }
}
