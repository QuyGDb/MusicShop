using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.UpdateArtist;

public record UpdateArtistCommand(
    Guid Id,
    string Name,
    string? Bio,
    string? Country,
    string? ImageUrl,
    List<Guid>? GenreIds = null) : IRequest<Result<Guid>>;
