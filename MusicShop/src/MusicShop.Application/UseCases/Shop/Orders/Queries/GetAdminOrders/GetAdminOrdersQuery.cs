using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Shop.Orders.Queries.GetAdminOrders;

public sealed record GetAdminOrdersQuery(
    OrderStatus? Status,
    int PageNumber = 1,
    int PageSize = 10) : IRequest<Result<PaginatedResult<OrderListItemDto>>>;
