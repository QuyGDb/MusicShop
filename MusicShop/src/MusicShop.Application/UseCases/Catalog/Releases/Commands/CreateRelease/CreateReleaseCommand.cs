using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Releases.Commands.CreateRelease;

public record CreateReleaseCommand(
    string Title,
    int Year,
    string? Genre,
    string? CoverUrl,
    string? Description,
    Guid ArtistId) : IRequest<Result<ReleaseResponse>>;
