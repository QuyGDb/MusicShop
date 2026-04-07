using System.Collections.Generic;
using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Catalog;

/// <summary>
/// Original album - e.g.: "Dark Side of the Moon" (1973)
/// </summary>
public class Release : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public int Year { get; set; } // Original release year
    public string? CoverUrl { get; set; }
    public string? Description { get; set; }

    // FK
    public Guid ArtistId { get; set; }
    public Artist Artist { get; set; } = null!;

    // Navigation: 1 Release (Master) has many Versions (Pressings)
    public ICollection<ReleaseVersion> Versions { get; set; } = new List<ReleaseVersion>();

    // Navigation: Tracks belong to the original release
    public ICollection<Track> Tracks { get; set; } = new List<Track>();
}
