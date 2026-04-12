using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.CreateProduct;

public sealed class CreateProductCommandHandler(
    IProductRepository productRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<CreateProductCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        Product product = new()
        {
            ReleaseVersionId = request.ReleaseVersionId,
            Name = request.Name,
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
