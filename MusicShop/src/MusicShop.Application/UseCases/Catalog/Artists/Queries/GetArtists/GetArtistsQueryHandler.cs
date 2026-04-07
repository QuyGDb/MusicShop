using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Queries.GetArtists;

public sealed class GetArtistsQueryHandler(IRepository<Artist> artistRepository)
    : IRequestHandler<GetArtistsQuery, Result<PaginatedResult<ArtistResponse>>>
{
    public async Task<Result<PaginatedResult<ArtistResponse>>> Handle(
        GetArtistsQuery request,
        CancellationToken cancellationToken)
    {
        // 1. Gọi hàm GetPagedAsync đã nâng cấp ở tầng Infrastructure
        var (items, totalCount) = await artistRepository.GetPagedAsync(
            request.PageNumber,
            request.PageSize);

        // 2. Chuyển đổi từ Entity sang DTO
        var artistResponses = items.Select(artist => new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Genre = null, // TODO: Map from ArtistGenres Many-to-Many
            Country = artist.Country,
            ImageUrl = artist.ImageUrl
        }).ToList();

        // 3. Đóng gói vào PaginatedResult
        var result = new PaginatedResult<ArtistResponse>(
            artistResponses,
            totalCount,
            request.PageNumber,
            request.PageSize);

        return Result<PaginatedResult<ArtistResponse>>.Success(result);
    }
}
