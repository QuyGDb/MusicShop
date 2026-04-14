using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Enums;
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

        // 2. Validate and Update Attributes based on Format
        switch (variant.Product.Format)
        {
            case ReleaseFormat.Vinyl when request.VinylAttributes is not null:
                variant.VinylAttributes ??= new VinylAttributes { ProductVariantId = variant.Id };
                variant.VinylAttributes.DiscColor = request.VinylAttributes.DiscColor;
                variant.VinylAttributes.WeightGrams = request.VinylAttributes.WeightGrams;
                variant.VinylAttributes.SpeedRpm = request.VinylAttributes.SpeedRpm;
                variant.VinylAttributes.DiscCount = request.VinylAttributes.DiscCount;
                variant.VinylAttributes.SleeveType = request.VinylAttributes.SleeveType;
                break;

            case ReleaseFormat.CD when request.CdAttributes is not null:
                variant.CdAttributes ??= new CdAttributes { ProductVariantId = variant.Id };
                variant.CdAttributes.Edition = request.CdAttributes.Edition;
                variant.CdAttributes.IsJapanEdition = request.CdAttributes.IsJapanEdition;
                break;

            case ReleaseFormat.Cassette when request.CassetteAttributes is not null:
                variant.CassetteAttributes ??= new CassetteAttributes { ProductVariantId = variant.Id };
                variant.CassetteAttributes.TapeColor = request.CassetteAttributes.TapeColor;
                variant.CassetteAttributes.Edition = request.CassetteAttributes.Edition;
                break;
        }

        // 3. Prevent cross-format attribute pollution
        if ((request.VinylAttributes is not null && variant.Product.Format != ReleaseFormat.Vinyl) ||
            (request.CdAttributes is not null && variant.Product.Format != ReleaseFormat.CD) ||
            (request.CassetteAttributes is not null && variant.Product.Format != ReleaseFormat.Cassette))
        {
            return Result.Failure(ProductErrors.InvalidAttributes);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
