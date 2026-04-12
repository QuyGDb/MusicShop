using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.CreateProductVariant;

public sealed class CreateProductVariantCommandValidator : AbstractValidator<CreateProductVariantCommand>
{
    public CreateProductVariantCommandValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();

        RuleFor(x => x.VariantName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Price).GreaterThan(0);

        RuleFor(x => x.StockQty).GreaterThanOrEqualTo(0);
    }
}
