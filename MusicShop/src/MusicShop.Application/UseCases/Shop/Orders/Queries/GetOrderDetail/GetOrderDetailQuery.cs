using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Orders.Queries.GetOrderDetail;

public sealed record GetOrderDetailQuery(Guid OrderId) : IRequest<Result<OrderDetailDto>>;
