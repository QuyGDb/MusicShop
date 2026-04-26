using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Cart.Commands.AddToCart;

/// <summary>
/// Command to add a product variant to the user's shopping cart
/// </summary>
public sealed record AddToCartCommand(
    Guid UserId,
    Guid ProductId,
    int Quantity) : IRequest<Result<Guid>>;
