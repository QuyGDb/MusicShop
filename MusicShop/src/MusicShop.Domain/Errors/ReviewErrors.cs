using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class ReviewErrors
{
    public static readonly Error OrderNotDelivered = new(
        "Review.OrderNotDelivered",
        "You can only review products from delivered orders.");

    public static readonly Error AlreadyReviewed = new(
        "Review.AlreadyReviewed",
        "You have already reviewed this product for this order.");

    public static readonly Error ProductNotInOrder = new(
        "Review.ProductNotInOrder",
        "The specified product was not found in this order.");
}
