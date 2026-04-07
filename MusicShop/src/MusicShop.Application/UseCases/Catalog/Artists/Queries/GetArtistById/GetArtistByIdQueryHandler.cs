using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtistById;

public sealed class GetArtistByIdQueryHandler(IRepository<Artist> artistRepository)
    : IRequestHandler<GetArtistByIdQuery, Result<ArtistResponse>>
{
    public async Task<Result<ArtistResponse>> Handle(
        GetArtistByIdQuery request, 
        CancellationToken cancellationToken)
    {
        var artist = await artistRepository.GetByIdAsync(request.Id);

        if (artist == null)
        {
            return Result<ArtistResponse>.Failure(ArtistErrors.NotFound);
        }

        return Result<ArtistResponse>.Success(new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Genre = null, // TODO: Map from ArtistGenres Many-to-Many
            Country = artist.Country,
            ImageUrl = artist.ImageUrl
        });
    }
}
