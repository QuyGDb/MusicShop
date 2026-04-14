using MediatR;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Catalog.Labels.Commands.CreateLabel;

public sealed class CreateLabelCommandHandler(
    IRepository<Label> labelRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateLabelCommand, Result<string>>
{
    public async Task<Result<string>> Handle(
        CreateLabelCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Check duplicate name
        Label? existingName = await labelRepository.FirstOrDefaultAsync(labelItem => labelItem.Name == request.Name, cancellationToken);
        if (existingName != null)
        {
            return Result<string>.Failure(LabelErrors.DuplicateName);
        }

        // 2. Check duplicate slug
        Label? existingSlug = await labelRepository.FirstOrDefaultAsync(labelItem => labelItem.Slug == request.Slug, cancellationToken);
        if (existingSlug != null)
        {
            return Result<string>.Failure(LabelErrors.DuplicateSlug);
        }

        Label label = new Label
        {
            Name = request.Name,
            Slug = request.Slug,
            Country = request.Country,
            FoundedYear = request.FoundedYear,
            Website = request.Website
        };

        labelRepository.Add(label);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(label.Slug);
    }
}
