using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Cart.Queries.GetCart;

/// <summary>
/// Query to retrieve the current user's shopping cart
/// </summary>
public sealed record GetCartQuery(Guid UserId) : IRequest<Result<CartDto>>;
