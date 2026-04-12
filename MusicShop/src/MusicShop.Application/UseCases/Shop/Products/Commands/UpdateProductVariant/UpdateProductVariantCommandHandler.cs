using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.UpdateProductVariant;

public sealed class UpdateProductVariantCommandHandler(
    IProductRepository productRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<UpdateProductVariantCommand, Result>
{
    public async Task<Result> Handle(UpdateProductVariantCommand request, CancellationToken cancellationToken)
    {
        ProductVariant? variant = await productRepository.GetVariantByIdAsync(
            request.ProductId, request.VariantId, cancellationToken);

        if (variant is null)
        {
            return Result.Failure(ProductErrors.VariantNotFound);
        }

        variant.VariantName = request.VariantName;
        variant.Price = request.Price;
        variant.StockQty = request.StockQty;
        variant.IsSigned = request.IsSigned;
        variant.IsAvailable = request.IsAvailable;

        if (request.VinylAttributes is not null && variant.VinylAttributes is not null)
        {
            variant.VinylAttributes.DiscColor = request.VinylAttributes.DiscColor;
            variant.VinylAttributes.WeightGrams = request.VinylAttributes.WeightGrams;
            variant.VinylAttributes.SpeedRpm = request.VinylAttributes.SpeedRpm;
            variant.VinylAttributes.DiscCount = request.VinylAttributes.DiscCount;
            variant.VinylAttributes.SleeveType = request.VinylAttributes.SleeveType;
        }

        if (request.CdAttributes is not null && variant.CdAttributes is not null)
        {
            variant.CdAttributes.Edition = request.CdAttributes.Edition;
            variant.CdAttributes.IsJapanEdition = request.CdAttributes.IsJapanEdition;
        }

        if (request.CassetteAttributes is not null && variant.CassetteAttributes is not null)
        {
            variant.CassetteAttributes.TapeColor = request.CassetteAttributes.TapeColor;
            variant.CassetteAttributes.Edition = request.CassetteAttributes.Edition;
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
