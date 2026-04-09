using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;

public sealed class CreateArtistCommandHandler(
    IRepository<Artist> artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateArtistCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(
        CreateArtistCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Check for duplicate name
        var existing = await artistRepository.FirstOrDefaultAsync(x => x.Name == request.Name, cancellationToken);
        if (existing != null)
        {
            return Result<Guid>.Failure(new Error("Artist.DuplicateName", "Artist with this name already exists."));
        }

        // 2. Create Artist entity
        var artist = new Artist
        {
            Name = request.Name,
            Bio = request.Bio,
            Country = request.Country,
            ImageUrl = request.ImageUrl
        };

        // 3. Handle Genres many-to-many
        if (request.GenreIds != null && request.GenreIds.Any())
        {
            foreach (var genreId in request.GenreIds)
            {
                artist.ArtistGenres.Add(new ArtistGenre
                {
                    GenreId = genreId
                });
            }
        }

        artistRepository.Add(artist);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(artist.Id);
    }
}
