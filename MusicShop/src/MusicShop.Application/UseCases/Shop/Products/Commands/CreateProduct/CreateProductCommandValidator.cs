using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.CreateProduct;

public sealed class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.ReleaseVersionId).NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.LimitedQty)
            .GreaterThan(0)
            .When(x => x.IsLimited);

        RuleFor(x => x.PreorderReleaseDate)
            .GreaterThan(DateTime.UtcNow)
            .When(x => x.IsPreorder);
    }
}
