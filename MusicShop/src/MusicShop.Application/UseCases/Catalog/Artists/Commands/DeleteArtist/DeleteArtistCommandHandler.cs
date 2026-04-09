using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.DeleteArtist;

public sealed class DeleteArtistCommandHandler(
    IRepository<Artist> artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteArtistCommand, Result>
{
    public async Task<Result> Handle(
        DeleteArtistCommand request, 
        CancellationToken cancellationToken)
    {
        var artist = await artistRepository.AsQueryable()
            .Include(x => x.Releases)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (artist == null)
        {
            return Result.Failure(new Error("Artist.NotFound", "Artist not found."));
        }

        if (artist.Releases.Any())
        {
            return Result.Failure(new Error("Artist.HasAssociations", "Cannot delete artist with existing releases."));
        }

        artistRepository.Delete(artist);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
