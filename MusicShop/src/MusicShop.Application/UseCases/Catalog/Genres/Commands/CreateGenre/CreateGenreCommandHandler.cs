using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Catalog.Genres.Commands.CreateGenre;

public sealed class CreateGenreCommandHandler(
    IRepository<Genre> genreRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateGenreCommand, Result<string>>
{
    public async Task<Result<string>> Handle(
        CreateGenreCommand request,
        CancellationToken cancellationToken)
    {
        // Check duplicate name
        Genre? existingName = await genreRepository.FirstOrDefaultAsync(
            genre => genre.Name == request.Name, cancellationToken);
        if (existingName != null)
        {
            return Result<string>.Failure(GenreErrors.DuplicateName);
        }

        // Check duplicate slug
        Genre? existingSlug = await genreRepository.FirstOrDefaultAsync(
            genre => genre.Slug == request.Slug, cancellationToken);
        if (existingSlug != null)
        {
            return Result<string>.Failure(GenreErrors.DuplicateSlug);
        }

        Genre genre = new()
        {
            Name = request.Name,
            Slug = request.Slug
        };

        genreRepository.Add(genre);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(genre.Slug);
    }
}
