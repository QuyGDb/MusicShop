using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using AutoMapper;

namespace MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtistById;

public sealed class GetArtistByIdQueryHandler(
    IArtistRepository artistRepository,
    IMapper mapper)
    : IRequestHandler<GetArtistByIdQuery, Result<ArtistResponse>>
{
    public async Task<Result<ArtistResponse>> Handle(
        GetArtistByIdQuery request,
        CancellationToken cancellationToken)
    {
        var artist = await artistRepository.GetWithGenresAsync(request.Id, cancellationToken);

        if (artist == null)
        {
            return Result<ArtistResponse>.Failure(new Error("Artist.NotFound", "Artist not found."));
        }

        var response = mapper.Map<ArtistResponse>(artist);

        return Result<ArtistResponse>.Success(response);
    }
}
