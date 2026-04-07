using MusicShop.Domain.Entities.Catalog;

namespace MusicShop.Domain.Interfaces;

public interface IArtistRepository : IRepository<Artist>
{
    // Get Artist details including list of Genres
    Task<Artist?> GetWithGenresAsync(Guid id, CancellationToken ct = default);

    // Get a paged list of Artists with their Genres
    Task<(IReadOnlyList<Artist> Items, int TotalCount)> GetPagedWithGenresAsync(
        int pageNumber, 
        int pageSize, 
        CancellationToken ct = default);
}
