using MusicShop.Domain.Common;

namespace MusicShop.Domain.Errors;

public static class CuratedCollectionErrors
{
    public static readonly Error NotFound = new("CuratedCollection.NotFound", "The curated collection was not found.", ErrorType.NotFound);
    public static readonly Error AlreadyInCollection = new("CuratedCollection.AlreadyInCollection", "The product is already in this collection.", ErrorType.Conflict);
    public static readonly Error ProductNotFound = new("CuratedCollection.ProductNotFound", "The product was not found.", ErrorType.NotFound);
}
