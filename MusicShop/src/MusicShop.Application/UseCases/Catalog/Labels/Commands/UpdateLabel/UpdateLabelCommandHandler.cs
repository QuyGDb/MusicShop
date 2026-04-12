using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Catalog.Labels.Commands.UpdateLabel;

public sealed class UpdateLabelCommandHandler(
    IRepository<Label> labelRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateLabelCommand, Result<string>>
{
    public async Task<Result<string>> Handle(
        UpdateLabelCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Find by Id
        Label? label = await labelRepository.GetByIdAsync(request.Id, cancellationToken);
        if (label == null)
        {
            return Result<string>.Failure(LabelErrors.NotFound);
        }

        // 2. Check duplicate name
        Label? existingName = await labelRepository.FirstOrDefaultAsync(
            x => x.Name == request.Name && x.Id != label.Id, cancellationToken);
        if (existingName != null)
        {
            return Result<string>.Failure(LabelErrors.DuplicateName);
        }

        // 3. Check duplicate slug
        Label? existingSlug = await labelRepository.FirstOrDefaultAsync(
            x => x.Slug == request.Slug && x.Id != label.Id, cancellationToken);
        if (existingSlug != null)
        {
            return Result<string>.Failure(LabelErrors.DuplicateSlug);
        }

        label.Name = request.Name;
        label.Slug = request.Slug;
        label.Country = request.Country;
        label.FoundedYear = request.FoundedYear;
        label.Website = request.Website;

        labelRepository.Update(label);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(label.Slug);
    }
}
