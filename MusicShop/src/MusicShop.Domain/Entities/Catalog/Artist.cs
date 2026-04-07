using System.Collections.Generic;
using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Catalog;

public class Artist : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Country { get; set; }
    public string? ImageUrl { get; set; }

    // Navigation: 1 Artist has many Releases (Master)
    public ICollection<Release> Releases { get; set; } = new List<Release>();

    // Navigation: Many-to-Many via junction table
    public ICollection<ArtistGenre> ArtistGenres { get; set; } = new List<ArtistGenre>();
}
