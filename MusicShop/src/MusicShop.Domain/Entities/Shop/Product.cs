using System.Collections.Generic;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Enums;

namespace MusicShop.Domain.Entities.Shop;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverUrl { get; set; }
    public bool IsActive { get; set; } = true;

    // Limited Edition
    public bool IsLimited { get; set; }
    public int? LimitedQty { get; set; }

    // Pre-order
    public bool IsPreorder { get; set; }
    public DateTime? PreorderReleaseDate { get; set; }

    // SKU Details
    public decimal Price { get; set; }
    public int StockQty { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool IsSigned { get; set; } = false;

    // FK (Products link to specific Pressings/Versions in ERD)
    public Guid? ReleaseVersionId { get; set; }
    public ReleaseVersion? ReleaseVersion { get; set; }

    // Navigation
    public VinylAttributes? VinylAttributes { get; set; }
    public CdAttributes? CdAttributes { get; set; }
    public CassetteAttributes? CassetteAttributes { get; set; }
    public ICollection<CuratedCollectionItem> CollectionItems { get; set; } = new List<CuratedCollectionItem>();
}
