using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;

public sealed class CreateArtistCommandHandler(
    IRepository<Artist> artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateArtistCommand, Result<ArtistResponse>>
{
    public async Task<Result<ArtistResponse>> Handle(
        CreateArtistCommand request,
        CancellationToken cancellationToken)
    {
        Artist? existingArtist = await artistRepository.FirstOrDefaultAsync(x => x.Name == request.Name);
        if (existingArtist != null)
        {
            return Result<ArtistResponse>.Failure(ArtistErrors.DuplicateName);
        }

        Artist artist = new Artist
        {
            Name = request.Name,
            Bio = request.Bio,
            // Genre is now Many-to-Many
            Country = request.Country,
            ImageUrl = request.ImageUrl
        };

        artistRepository.Add(artist);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<ArtistResponse>.Success(new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Genres = new List<GenreResponse>(), // NO Genres on initial creation usually, or map if added to command
            Country = artist.Country,
            ImageUrl = artist.ImageUrl
        });
    }
}
