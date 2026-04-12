using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Releases.Queries.GetReleaseBySlug;

public sealed record GetReleaseBySlugQuery(string Slug) : IRequest<Result<ReleaseDetailResponse>>;
