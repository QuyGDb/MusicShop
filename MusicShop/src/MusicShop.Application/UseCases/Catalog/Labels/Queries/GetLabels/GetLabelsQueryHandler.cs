using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.Common.Mappings;

namespace MusicShop.Application.UseCases.Catalog.Labels.Queries.GetLabels;

public sealed class GetLabelsQueryHandler(ILabelRepository labelRepository)
    : IRequestHandler<GetLabelsQuery, Result<PaginatedResult<LabelResponse>>>
{
    public async Task<Result<PaginatedResult<LabelResponse>>> Handle(
        GetLabelsQuery request, 
        CancellationToken cancellationToken)
    {
        var (items, totalCount) = await labelRepository.GetPagedAsync(request, cancellationToken);

        List<LabelResponse> labelResponses = items.Select(label => label.ToResponse()).ToList();

        PaginatedResult<LabelResponse> result = new PaginatedResult<LabelResponse>(
            labelResponses, 
            totalCount, 
            request.PageNumber, 
            request.PageSize);

        return Result<PaginatedResult<LabelResponse>>.Success(result);
    }
}
