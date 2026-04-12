using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Application.DTOs.Catalog;

namespace MusicShop.Application.UseCases.Catalog.Releases.Commands.CreateRelease;

public record CreateReleaseCommand(
    string Title,
    int Year,
    string? Type,
    Guid ArtistId,
    string? CoverUrl,
    string? Description,
    List<Guid>? GenreIds,
    List<TrackCreateDto>? Tracks) : IRequest<Result<Guid>>;
