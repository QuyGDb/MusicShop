using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class CuratedCollectionItem : BaseEntity
{
    public Guid CollectionId { get; set; }
    public CuratedCollection Collection { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int SortOrder { get; set; }
}
