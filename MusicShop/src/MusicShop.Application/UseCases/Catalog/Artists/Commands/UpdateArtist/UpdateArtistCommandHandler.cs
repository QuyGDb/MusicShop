using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.UpdateArtist;

public sealed class UpdateArtistCommandHandler(
    IRepository<Artist> artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateArtistCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(
        UpdateArtistCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Fetch artist including Genres
        var artist = await artistRepository.AsQueryable()
            .Include(x => x.ArtistGenres)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (artist == null)
        {
            return Result<Guid>.Failure(new Error("Artist.NotFound", "Artist not found."));
        }

        // 2. Check for duplicate name
        var existingWithSameName = await artistRepository.FirstOrDefaultAsync(
            x => x.Name == request.Name && x.Id != request.Id, cancellationToken);
        
        if (existingWithSameName != null)
        {
            return Result<Guid>.Failure(new Error("Artist.DuplicateName", "Another artist with this name already exists."));
        }

        // 3. Update basic info
        artist.Name = request.Name;
        artist.Bio = request.Bio;
        artist.Country = request.Country;
        artist.ImageUrl = request.ImageUrl;

        // 4. Update Genres (Many-to-Many synchronization)
        if (request.GenreIds != null)
        {
            artist.ArtistGenres.Clear();
            foreach (var genreId in request.GenreIds)
            {
                artist.ArtistGenres.Add(new ArtistGenre { GenreId = genreId });
            }
        }

        artistRepository.Update(artist);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(artist.Id);
    }
}
