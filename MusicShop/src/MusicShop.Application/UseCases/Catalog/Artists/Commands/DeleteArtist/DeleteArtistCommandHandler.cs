using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.DeleteArtist;

public sealed class DeleteArtistCommandHandler(
    IArtistRepository artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteArtistCommand, Result>
{
    public async Task<Result> Handle(
        DeleteArtistCommand request,
        CancellationToken cancellationToken)
    {
        Artist? artist = await artistRepository.GetWithReleasesAsync(request.Id, cancellationToken);

        if (artist == null)
        {
            return Result.Failure(ArtistErrors.NotFound);
        }

        if (artist.Releases.Count > 0)
        {
            return Result.Failure(ArtistErrors.HasAssociations);
        }

        artistRepository.Delete(artist);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
