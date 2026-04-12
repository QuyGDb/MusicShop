using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class OrderErrors
{
    public static readonly Error CartEmpty = new(
        "Order.CartEmpty",
        "Your cart is empty. Please add items before placing an order.");

    public static readonly Error NotFound = new(
        "Order.NotFound",
        "The specified order was not found.");

    public static readonly Error CannotCancel = new(
        "Order.CannotCancel",
        "This order cannot be cancelled in its current state.");
}
