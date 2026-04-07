namespace MusicShop.Application.DTOs.Catalog;

public class ArtistResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public List<GenreResponse> Genres { get; set; } = new();
    public string? Country { get; set; }
    public string? ImageUrl { get; set; }
}
