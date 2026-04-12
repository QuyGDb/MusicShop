using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;
using MusicShop.Application.DTOs.Catalog;

namespace MusicShop.Application.UseCases.Catalog.Releases.Commands.CreateRelease;

public sealed class CreateReleaseCommandHandler(
    IRepository<Release> releaseRepository,
    IRepository<Artist> artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateReleaseCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(
        CreateReleaseCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Verify Artist exists
        Artist? artist = await artistRepository.GetByIdAsync(request.ArtistId, cancellationToken);
        if (artist == null)
        {
            return Result<Guid>.Failure(ArtistErrors.NotFound);
        }

        // 2. Check for duplicate slug
        bool slugExists = await releaseRepository.AnyAsync(x => x.Slug == request.Slug, cancellationToken);
        if (slugExists)
        {
            return Result<Guid>.Failure(ReleaseErrors.DuplicateSlug);
        }

        // 3. Map Command to Entity
        Release release = new Release
        {
            Title = request.Title,
            Slug = request.Slug,
            Year = request.Year,
            Type = request.Type,
            ArtistId = request.ArtistId,
            CoverUrl = request.CoverUrl,
            Description = request.Description
        };

        // 3. Add Genres
        if (request.GenreIds != null)
        {
            foreach (Guid genreId in request.GenreIds)
            {
                release.ReleaseGenres.Add(new ReleaseGenre { GenreId = genreId });
            }
        }

        // 4. Add Tracks
        if (request.Tracks != null)
        {
            foreach (TrackCreateDto trackDto in request.Tracks)
            {
                release.Tracks.Add(new Track
                {
                    Title = trackDto.Title,
                    Position = trackDto.Position,
                    DurationSeconds = trackDto.DurationSeconds,
                    Side = trackDto.Side
                });
            }
        }

        releaseRepository.Add(release);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(release.Id);
    }
}
