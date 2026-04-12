using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Genres.Commands.UpdateGenre;

public sealed class UpdateGenreCommandHandler(
    IRepository<Genre> genreRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<UpdateGenreCommand, Result<GenreResponse>>
{
    public async Task<Result<GenreResponse>> Handle(UpdateGenreCommand request, CancellationToken cancellationToken)
    {
        Genre? genre = await genreRepository.FirstOrDefaultAsync(x => x.Slug == request.Slug, cancellationToken);
        
        if (genre == null)
        {
            return Result<GenreResponse>.Failure(GenreErrors.NotFound);
        }

        genre.Name = request.Name;
        genre.UpdatedAt = DateTime.UtcNow;

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<GenreResponse>.Success(new GenreResponse 
        { 
            Id = genre.Id, 
            Name = genre.Name, 
            Slug = genre.Slug 
        });
    }
}
