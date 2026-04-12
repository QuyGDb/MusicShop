using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.CreateProduct;

public sealed class CreateProductCommandHandler(
    IProductRepository productRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<CreateProductCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // 1. Check for duplicate slug
        bool slugExists = await productRepository.AnyAsync(x => x.Slug == request.Slug, cancellationToken);
        if (slugExists)
        {
            return Result<Guid>.Failure(ProductErrors.DuplicateSlug);
        }

        Product product = new()
        {
            ReleaseVersionId = request.ReleaseVersionId,
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            CoverUrl = request.CoverUrl,
            Format = request.Format,
            IsLimited = request.IsLimited,
            LimitedQty = request.LimitedQty,
            IsPreorder = request.IsPreorder,
            PreorderReleaseDate = request.PreorderReleaseDate,
            IsActive = true
        };

        productRepository.Add(product);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(product.Id);
    }
}
