using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Releases.Commands.CreateRelease;

public sealed class CreateReleaseCommandHandler(
    IRepository<Artist> artistRepository,
    IRepository<Release> releaseRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateReleaseCommand, Result<ReleaseResponse>>
{
    public async Task<Result<ReleaseResponse>> Handle(
        CreateReleaseCommand request,
        CancellationToken cancellationToken)
    {
        var artist = await artistRepository.GetByIdAsync(request.ArtistId);
        if (artist == null)
        {
            return Result<ReleaseResponse>.Failure(MasterReleaseErrors.ArtistNotFound);
        }

        var release = new Release
        {
            Title = request.Title,
            Year = request.Year,
            // Genre is now Many-to-Many, will be handled in separate service/logic later
            CoverUrl = request.CoverUrl,
            Description = request.Description,
            ArtistId = request.ArtistId
        };

        releaseRepository.Add(release);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<ReleaseResponse>.Success(new ReleaseResponse
        {
            Id = release.Id,
            Title = release.Title,
            Year = release.Year,
            CoverUrl = release.CoverUrl,
            Description = release.Description,
            ArtistId = release.ArtistId,
            ArtistName = artist.Name
        });
    }
}
