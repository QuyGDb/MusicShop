namespace MusicShop.Domain.Entities.Catalog;

public class ReleaseGenre
{
    public Guid ReleaseId { get; set; }
    public Release Release { get; set; } = null!;

    public Guid GenreId { get; set; }
    public Genre Genre { get; set; } = null!;
}
