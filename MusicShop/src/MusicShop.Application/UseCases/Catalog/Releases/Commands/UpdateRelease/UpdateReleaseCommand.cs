using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Application.DTOs.Catalog;

namespace MusicShop.Application.UseCases.Catalog.Releases.Commands.UpdateRelease;

public record UpdateReleaseCommand(
    Guid Id,
    string Title,
    string Slug,
    int Year,
    Guid ArtistId,
    string? CoverUrl,
    string? Description,
    List<Guid>? GenreIds,
    List<TrackCreateDto>? Tracks) : IRequest<Result<Guid>>;
