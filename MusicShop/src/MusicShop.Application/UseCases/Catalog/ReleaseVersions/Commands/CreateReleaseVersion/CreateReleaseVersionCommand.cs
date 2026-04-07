using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.CreateReleaseVersion;

public record CreateReleaseVersionCommand(
    Guid ReleaseId,
    Guid LabelId,
    string? PressingCountry,
    int? PressingYear,
    ReleaseFormat Format,
    string? CatalogNumber,
    string? Notes) : IRequest<Result<ReleaseVersionDto>>;
