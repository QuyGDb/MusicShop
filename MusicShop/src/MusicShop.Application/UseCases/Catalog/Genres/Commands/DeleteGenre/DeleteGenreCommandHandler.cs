using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Catalog.Genres.Commands.DeleteGenre;

public sealed class DeleteGenreCommandHandler(
    IGenreRepository genreRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<DeleteGenreCommand, Result>
{
    public async Task<Result> Handle(DeleteGenreCommand request, CancellationToken cancellationToken)
    {
        Genre? genre = await genreRepository.GetWithAssociationsAsync(request.Id, cancellationToken);

        if (genre is null)
        {
            return Result.Failure(GenreErrors.NotFound);
        }

        if (genre.ArtistGenres.Any() || genre.ReleaseGenres.Any())
        {
            return Result.Failure(GenreErrors.HasAssociations);
        }

        genreRepository.Delete(genre);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
