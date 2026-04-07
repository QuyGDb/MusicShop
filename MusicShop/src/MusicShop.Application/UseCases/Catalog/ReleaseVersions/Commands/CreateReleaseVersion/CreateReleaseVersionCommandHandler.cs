using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Catalog.ReleaseVersions.Commands.CreateReleaseVersion;

public sealed class CreateReleaseVersionCommandHandler(
    IRepository<Release> releaseRepository,
    IRepository<Label> labelRepository,
    IReleaseVersionRepository releaseVersionRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateReleaseVersionCommand, Result<ReleaseVersionDto>>
{
    public async Task<Result<ReleaseVersionDto>> Handle(
        CreateReleaseVersionCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Verify Release
        var release = await releaseRepository.GetByIdAsync(request.ReleaseId);
        if (release == null)
            return Result<ReleaseVersionDto>.Failure(ReleaseErrors.NotFound);

        // 2. Verify Label
        var label = await labelRepository.GetByIdAsync(request.LabelId);
        if (label == null)
            return Result<ReleaseVersionDto>.Failure(LabelErrors.NotFound);

        // 3. Create Version
        var version = new ReleaseVersion
        {
            ReleaseId = request.ReleaseId,
            LabelId = request.LabelId,
            PressingCountry = request.PressingCountry,
            PressingYear = request.PressingYear,
            Format = request.Format,
            CatalogNumber = request.CatalogNumber,
            Notes = request.Notes
        };

        releaseVersionRepository.Add(version);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<ReleaseVersionDto>.Success(new ReleaseVersionDto
        {
            Id = version.Id,
            PressingCountry = version.PressingCountry,
            PressingYear = version.PressingYear,
            Format = version.Format.ToString().ToLower(),
            CatalogNumber = version.CatalogNumber,
            Notes = version.Notes,
            LabelName = label.Name
        });
    }
}
