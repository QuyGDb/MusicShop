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
}
