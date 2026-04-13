using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

/// <summary>
/// Domain errors for Product entity
/// </summary>
public static class ProductErrors
{
    public static readonly Error NotFound = new(
        "Product.NotFound", 
        "The specified product was not found.",
        ErrorType.NotFound);

    public static readonly Error VariantNotFound = new(
        "Product.VariantNotFound",
        "The selected product variant does not exist.",
        ErrorType.NotFound);

    public static readonly Error LimitedQtyLocked = new(
        "Product.LimitedQtyLocked",
        "Limited quantity cannot be increased after orders have been placed.",
        ErrorType.Conflict);

    public static readonly Error HasPendingOrders = new(
        "Product.HasPendingOrders",
        "Cannot deactivate a product that has pending or confirmed orders.",
        ErrorType.Conflict);

    public static readonly Error VariantBelongsToAnotherProduct = new(
        "Product.VariantBelongsToAnotherProduct",
        "The specified variant does not belong to this product.",
        ErrorType.Validation);

    public static readonly Error InsufficientStock = new(
        "Product.InsufficientStock",
        "Not enough stock available for the selected variant.",
        ErrorType.Validation);

    public static readonly Error DuplicateSlug = new(
        "Product.DuplicateSlug",
        "The specified slug is already in use by another product.",
        ErrorType.Conflict);
}
