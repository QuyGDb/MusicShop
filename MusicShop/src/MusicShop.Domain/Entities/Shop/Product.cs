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
    public ReleaseFormat Format { get; set; } // Renamed from Type, matching ReleaseFormat enum
    public bool IsActive { get; set; } = true;

    // Limited Edition
    public bool IsLimited { get; set; }
    public int? LimitedQty { get; set; }

    // Pre-order
    public bool IsPreorder { get; set; }
    public DateTime? PreorderReleaseDate { get; set; }

    // FK (Products link to specific Pressings/Versions in ERD)
    public Guid? ReleaseVersionId { get; set; }
    public ReleaseVersion? ReleaseVersion { get; set; }

    // Navigation
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<CuratedCollectionItem> CollectionItems { get; set; } = new List<CuratedCollectionItem>();
}
