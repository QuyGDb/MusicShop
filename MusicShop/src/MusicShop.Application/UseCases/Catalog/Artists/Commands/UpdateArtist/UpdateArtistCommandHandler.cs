using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.UpdateArtist;

public sealed class UpdateArtistCommandHandler(
    IRepository<Artist> artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateArtistCommand, Result<ArtistResponse>>
{
    public async Task<Result<ArtistResponse>> Handle(
        UpdateArtistCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Check if artist exists
        Artist? artist = await artistRepository.GetByIdAsync(request.Id);
        if (artist == null)
        {
            return Result<ArtistResponse>.Failure(ArtistErrors.NotFound);
        }

        // 2. Check for duplicate name with others
        Artist? existingWithSameName = await artistRepository.FirstOrDefaultAsync(
            x => x.Name == request.Name && x.Id != request.Id);
        
        if (existingWithSameName != null)
        {
            return Result<ArtistResponse>.Failure(ArtistErrors.DuplicateName);
        }

        // 3. Update information
        artist.Name = request.Name;
        artist.Bio = request.Bio;
        // artist.Genre = request.Genre; // Genre is now Many-to-Many
        artist.Country = request.Country;
        artist.ImageUrl = request.ImageUrl;

        artistRepository.Update(artist);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<ArtistResponse>.Success(new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Genres = new List<GenreResponse>(), // Genres handled by separate command or loaded on request
            Country = artist.Country,
            ImageUrl = artist.ImageUrl
        });
    }
}
