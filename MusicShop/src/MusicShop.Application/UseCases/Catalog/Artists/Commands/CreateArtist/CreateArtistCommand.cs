using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;

public record CreateArtistCommand(
    string Name,
    string? Bio,
    string? Country,
    string? ImageUrl,
    List<Guid>? GenreIds = null) : IRequest<Result<Guid>>;
