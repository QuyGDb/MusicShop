using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Cart.Commands.UpdateCartItem;

/// <summary>
/// Command to update the quantity of an item in the shopping cart
/// </summary>
public sealed record UpdateCartItemCommand(
    Guid UserId,
    Guid CartItemId,
    int NewQuantity) : IRequest<Result>;
