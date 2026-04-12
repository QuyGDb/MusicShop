using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Shop.Orders.Queries.GetOrderHistory;

public sealed record GetOrderHistoryQuery(
    OrderStatus? Status,
    int Page = 1,
    int Limit = 10) : IRequest<Result<PaginatedResult<OrderListItemDto>>>;
