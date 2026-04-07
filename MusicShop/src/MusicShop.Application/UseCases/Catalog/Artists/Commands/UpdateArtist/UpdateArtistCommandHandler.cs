using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.UpdateArtist;

public sealed class UpdateArtistCommandHandler(
    IRepository<Artist> artistRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateArtistCommand, Result<ArtistResponse>>
{
    public async Task<Result<ArtistResponse>> Handle(
        UpdateArtistCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Kiểm tra tồn tại
        var artist = await artistRepository.GetByIdAsync(request.Id);
        if (artist == null)
        {
            return Result<ArtistResponse>.Failure(ArtistErrors.NotFound);
        }

        // 2. Kiểm tra trùng tên với người khác
        var existingWithSameName = await artistRepository.FirstOrDefaultAsync(
            x => x.Name == request.Name && x.Id != request.Id);
        
        if (existingWithSameName != null)
        {
            return Result<ArtistResponse>.Failure(ArtistErrors.DuplicateName);
        }

        // 3. Cập nhật thông tin
        artist.Name = request.Name;
        artist.Bio = request.Bio;
        // artist.Genre = request.Genre; // Genre is now Many-to-Many
        artist.Country = request.Country;
        artist.ImageUrl = request.ImageUrl;

        artistRepository.Update(artist);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<ArtistResponse>.Success(new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Genre = null, // TODO: Map from ArtistGenres
            Country = artist.Country,
            ImageUrl = artist.ImageUrl
        });
    }
}
