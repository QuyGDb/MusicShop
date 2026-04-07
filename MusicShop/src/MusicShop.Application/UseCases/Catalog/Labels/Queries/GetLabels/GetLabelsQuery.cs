using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Labels.Queries.GetLabels;

public sealed record GetLabelsQuery(
    int PageNumber = 1, 
    int PageSize = 20, 
    string? Q = null, 
    string? Country = null) 
    : IRequest<Result<PaginatedResult<LabelResponse>>>;
