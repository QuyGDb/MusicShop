using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.CreateProductVariant;

public sealed class CreateProductVariantCommandHandler(
    IProductRepository productRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<CreateProductVariantCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(CreateProductVariantCommand request, CancellationToken cancellationToken)
    {
        Domain.Entities.Shop.Product? product = await productRepository.GetByIdAsync(request.ProductId, cancellationToken);

        if (product is null)
        {
            return Result<Guid>.Failure(ProductErrors.NotFound);
        }

        ProductVariant variant = new()
        {
            ProductId = request.ProductId,
            VariantName = request.VariantName,
            Price = request.Price,
            StockQty = request.StockQty,
            IsSigned = request.IsSigned,
            IsAvailable = true
        };

        if (request.VinylAttributes is not null)
        {
            variant.VinylAttributes = new VinylAttributes
            {
                DiscColor = request.VinylAttributes.DiscColor,
                WeightGrams = request.VinylAttributes.WeightGrams,
                SpeedRpm = request.VinylAttributes.SpeedRpm,
                DiscCount = request.VinylAttributes.DiscCount,
                SleeveType = request.VinylAttributes.SleeveType
            };
        }

        if (request.CdAttributes is not null)
        {
            variant.CdAttributes = new CdAttributes
            {
                Edition = request.CdAttributes.Edition,
                IsJapanEdition = request.CdAttributes.IsJapanEdition
            };
        }

        if (request.CassetteAttributes is not null)
        {
            variant.CassetteAttributes = new CassetteAttributes
            {
                TapeColor = request.CassetteAttributes.TapeColor,
                Edition = request.CassetteAttributes.Edition
            };
        }

        product.Variants.Add(variant);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(variant.Id);
    }
}
