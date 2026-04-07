using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtistById;

public sealed class GetArtistByIdQueryHandler(IArtistRepository artistRepository)
    : IRequestHandler<GetArtistByIdQuery, Result<ArtistResponse>>
{
    public async Task<Result<ArtistResponse>> Handle(
        GetArtistByIdQuery request, 
        CancellationToken cancellationToken)
    {
        Artist? artist = await artistRepository.GetWithGenresAsync(request.Id, cancellationToken);

        if (artist == null)
        {
            return Result<ArtistResponse>.Failure(ArtistErrors.NotFound);
        }

        return Result<ArtistResponse>.Success(new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Genres = artist.ArtistGenres.Select(ag => new GenreResponse
            {
                Id = ag.GenreId,
                Name = ag.Genre?.Name ?? string.Empty,
                Slug = ag.Genre?.Slug ?? string.Empty
            }).ToList(),
            Country = artist.Country,
            ImageUrl = artist.ImageUrl
        });
    }
}
