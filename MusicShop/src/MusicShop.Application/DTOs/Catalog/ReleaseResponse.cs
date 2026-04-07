namespace MusicShop.Application.DTOs.Catalog;

public class ReleaseResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Year { get; set; }
    public string? Genre { get; set; }
    public string? CoverUrl { get; set; }
    public string? Description { get; set; }
    public Guid ArtistId { get; set; }
    public string ArtistName { get; set; } = string.Empty;
}
