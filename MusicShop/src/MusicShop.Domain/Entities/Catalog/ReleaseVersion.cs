using System.Collections.Generic;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Domain.Entities.Catalog;

/// <summary>
/// Specific pressing - e.g.: "Dark Side of the Moon - US 1973 first press"
/// </summary>
public class ReleaseVersion : BaseEntity
{
    public string? PressingCountry { get; set; }
    public int? PressingYear { get; set; }
    public ReleaseFormat Format { get; set; }
    public string? CatalogNumber { get; set; }
    public string? Notes { get; set; }

    // FK
    public Guid ReleaseId { get; set; }
    public Release Release { get; set; } = null!;

    public Guid LabelId { get; set; }
    public Label Label { get; set; } = null!;

    // Navigation
    // Tracklist is attached to Release (Master) in ERD, but some entities might keep it here if version-specific.
    // ERD says tracks belong to releases (original), so I'll move them later.
}
