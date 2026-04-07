using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Catalog;

public class Genre : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}
