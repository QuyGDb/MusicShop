using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

/// <summary>
/// Domain errors for Product entity
/// </summary>
public static class ProductErrors
{
    public static readonly Error NotFound = new(
        "Product.NotFound", 
        "The specified product was not found.");

    public static readonly Error VariantNotFound = new(
        "Product.VariantNotFound",
        "The selected product variant does not exist.");

    public static readonly Error LimitedQtyLocked = new(
        "Product.LimitedQtyLocked",
        "Limited quantity cannot be increased after orders have been placed.");

    public static readonly Error HasPendingOrders = new(
        "Product.HasPendingOrders",
        "Cannot deactivate a product that has pending or confirmed orders.");

    public static readonly Error VariantBelongsToAnotherProduct = new(
        "Product.VariantBelongsToAnotherProduct",
        "The specified variant does not belong to this product.");

    public static readonly Error InsufficientStock = new(
        "Product.InsufficientStock",
        "Not enough stock available for the selected variant.");
}
