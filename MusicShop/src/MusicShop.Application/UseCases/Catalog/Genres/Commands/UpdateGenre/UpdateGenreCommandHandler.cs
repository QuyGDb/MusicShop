using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

using MusicShop.Application.Common.Mappings;

namespace MusicShop.Application.UseCases.Catalog.Genres.Commands.UpdateGenre;

public sealed class UpdateGenreCommandHandler(
    IRepository<Genre> genreRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<UpdateGenreCommand, Result<GenreResponse>>
{
    public async Task<Result<GenreResponse>> Handle(UpdateGenreCommand request, CancellationToken cancellationToken)
    {
        Genre? genre = await genreRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (genre == null)
        {
            return Result<GenreResponse>.Failure(GenreErrors.NotFound);
        }

        // Check duplicate name
        Genre? existingName = await genreRepository.FirstOrDefaultAsync(
            g => g.Name == request.Name && g.Id != genre.Id, cancellationToken);
        if (existingName != null)
        {
            return Result<GenreResponse>.Failure(GenreErrors.DuplicateName);
        }

        // Check duplicate slug
        Genre? existingSlug = await genreRepository.FirstOrDefaultAsync(
            g => g.Slug == request.Slug && g.Id != genre.Id, cancellationToken);
        if (existingSlug != null)
        {
            return Result<GenreResponse>.Failure(GenreErrors.DuplicateSlug);
        }

        genre.Name = request.Name;
        genre.Slug = request.Slug;
        genre.UpdatedAt = DateTime.UtcNow;

        genreRepository.Update(genre);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<GenreResponse>.Success(genre.ToResponse());
    }
}
