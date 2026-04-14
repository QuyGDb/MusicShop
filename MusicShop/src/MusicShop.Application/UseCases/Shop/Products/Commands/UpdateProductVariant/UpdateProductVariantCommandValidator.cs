using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.UpdateProductVariant;

public sealed class UpdateProductVariantCommandValidator : AbstractValidator<UpdateProductVariantCommand>
{
    public UpdateProductVariantCommandValidator()
    {
        RuleFor(command => command.ProductId)
            .NotEmpty();

        RuleFor(command => command.VariantId)
            .NotEmpty();

        RuleFor(command => command.VariantName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(command => command.Price)
            .GreaterThan(0);

        RuleFor(command => command.StockQty)
            .GreaterThanOrEqualTo(0);
    }
}
