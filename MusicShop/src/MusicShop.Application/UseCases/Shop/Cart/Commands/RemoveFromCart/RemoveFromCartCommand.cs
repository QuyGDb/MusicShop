using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Cart.Commands.RemoveFromCart;

/// <summary>
/// Command to remove an item from the shopping cart
/// </summary>
public sealed record RemoveFromCartCommand(
    Guid UserId, 
    Guid CartItemId) : IRequest<Result>;
