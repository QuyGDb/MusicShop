using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

/// <summary>
/// Domain errors for Shopping Cart operations
/// </summary>
public static class CartErrors
{
    public static readonly Error NotFound = new(
        "Cart.NotFound", 
        "Shopping cart not found for this user.");

    public static readonly Error ItemNotFound = new(
        "Cart.ItemNotFound", 
        "The specified item was not found in the cart.");

    public static readonly Error InsufficientStock = new(
        "Cart.InsufficientStock", 
        "The requested quantity exceeds available stock.");
}
