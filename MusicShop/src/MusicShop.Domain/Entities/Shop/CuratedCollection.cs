using System.Collections.Generic;
using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

/// <summary>
/// Editorial/Curated collections managed by Admin
/// </summary>
public class CuratedCollection : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;

    public ICollection<CuratedCollectionItem> Items { get; set; } = new List<CuratedCollectionItem>();
}
