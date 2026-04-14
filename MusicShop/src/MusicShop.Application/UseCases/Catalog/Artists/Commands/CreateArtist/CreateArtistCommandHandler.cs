using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;

public sealed class CreateArtistCommandHandler(
    IRepository<Artist> artistRepository,
    IRepository<Genre> genreRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateArtistCommand, Result<string>>
{
    public async Task<Result<string>> Handle(
        CreateArtistCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Check for duplicate name
        Artist? existingName = await artistRepository.FirstOrDefaultAsync(artist => artist.Name == request.Name, cancellationToken);
        if (existingName != null)
        {
            return Result<string>.Failure(ArtistErrors.DuplicateName);
        }

        // 2. Check for duplicate slug
        Artist? existingSlug = await artistRepository.FirstOrDefaultAsync(artist => artist.Slug == request.Slug, cancellationToken);
        if (existingSlug != null)
        {
            return Result<string>.Failure(ArtistErrors.DuplicateSlug);
        }

        // 3. Validate Genres existence
        if (request.GenreIds is { Count: > 0 })
        {
            // Remove duplicates from request to avoid double count
            List<Guid> distinctGenreIds = request.GenreIds.Distinct().ToList();
            
            int existingGenresCount = await genreRepository.CountAsync(
                genre => distinctGenreIds.Contains(genre.Id), cancellationToken);

            if (existingGenresCount != distinctGenreIds.Count)
            {
                return Result<string>.Failure(GenreErrors.NotFound);
            }
        }

        // 4. Create Artist entity
        Artist artist = new Artist
        {
            Name = request.Name,
            Slug = request.Slug,
            Bio = request.Bio,
            Country = request.Country,
            ImageUrl = request.ImageUrl
        };

        // 5. Handle Genres many-to-many
        if (request.GenreIds is { Count: > 0 })
        {
            foreach (Guid genreId in request.GenreIds.Distinct())
            {
                artist.ArtistGenres.Add(new ArtistGenre
                {
                    GenreId = genreId
                });
            }
        }

        artistRepository.Add(artist);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(artist.Slug);
    }
}
