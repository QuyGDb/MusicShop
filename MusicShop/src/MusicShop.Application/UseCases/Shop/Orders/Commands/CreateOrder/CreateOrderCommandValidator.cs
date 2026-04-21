using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.Orders.Commands.CreateOrder;

public sealed class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.RecipientName)
            .NotEmpty().WithMessage("Shipping name is required.")
            .MaximumLength(100);

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Shipping phone is required.")
            .Matches(@"^[0-9\+\-\s]+$").WithMessage("Invalid phone number format.");

        RuleFor(x => x.ShippingAddress)
            .NotEmpty().WithMessage("Shipping address is required.")
            .MaximumLength(500);

        RuleFor(x => x.PaymentGateway)
            .IsInEnum().WithMessage("Invalid payment method.");
        
        RuleFor(x => x.Note)
            .MaximumLength(500);
    }
}
