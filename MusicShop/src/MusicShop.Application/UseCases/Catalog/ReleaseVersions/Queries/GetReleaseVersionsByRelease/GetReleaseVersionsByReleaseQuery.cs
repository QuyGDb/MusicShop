using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.ReleaseVersions.Queries.GetReleaseVersionsByRelease;

public record GetReleaseVersionsByReleaseQuery(Guid ReleaseId) 
    : IRequest<Result<IReadOnlyList<ReleaseVersionDto>>>;
