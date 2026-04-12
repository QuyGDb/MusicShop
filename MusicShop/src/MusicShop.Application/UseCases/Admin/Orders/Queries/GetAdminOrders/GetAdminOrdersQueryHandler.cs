using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Admin.Orders.Queries.GetAdminOrders;

public sealed class GetAdminOrdersQueryHandler(
    IOrderRepository orderRepository) : IRequestHandler<GetAdminOrdersQuery, Result<PaginatedResult<OrderListItemDto>>>
{
    public async Task<Result<PaginatedResult<OrderListItemDto>>> Handle(GetAdminOrdersQuery request, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await orderRepository.GetPagedAllAsync(
            request.Status,
            request.PageNumber,
            request.PageSize,
            cancellationToken);

        var dtos = items.Select(o => new OrderListItemDto(
            o.Id,
            o.Status,
            o.TotalAmount,
            o.CreatedAt,
            o.OrderItems.Count
        )).ToList();

        return Result<PaginatedResult<OrderListItemDto>>.Success(
            new PaginatedResult<OrderListItemDto>(dtos, totalCount, request.PageNumber, request.PageSize));
    }
}
