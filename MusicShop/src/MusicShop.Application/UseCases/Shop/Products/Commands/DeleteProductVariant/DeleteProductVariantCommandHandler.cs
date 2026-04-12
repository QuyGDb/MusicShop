using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.DeleteProductVariant;

public sealed class DeleteProductVariantCommandHandler(
    IProductRepository productRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<DeleteProductVariantCommand, Result>
{
    public async Task<Result> Handle(DeleteProductVariantCommand request, CancellationToken cancellationToken)
    {
        ProductVariant? variant = await productRepository.GetVariantByIdAsync(
            request.ProductId, request.VariantId, cancellationToken);

        if (variant is null)
        {
            return Result.Failure(ProductErrors.VariantNotFound);
        }

        productRepository.DeleteVariant(variant);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
