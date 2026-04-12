using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Cart.Commands.UpdateCartItem;

/// <summary>
/// Handler for UpdateCartItemCommand.
/// Validates stock before updating quantity.
/// </summary>
public sealed class UpdateCartItemCommandHandler : IRequestHandler<UpdateCartItemCommand, Result>
{
    private readonly ICartRepository _cartRepository;
    private readonly IRepository<ProductVariant> _variantRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCartItemCommandHandler(
        ICartRepository cartRepository,
        IRepository<ProductVariant> variantRepository,
        IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _variantRepository = variantRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        // 1. Get tracked cart
        var cart = await _cartRepository.GetByUserIdForUpdateAsync(request.UserId, cancellationToken);
        if (cart == null)
        {
            return Result.Failure(CartErrors.NotFound);
        }

        // 2. Find item
        var item = cart.Items.FirstOrDefault(i => i.Id == request.CartItemId);
        if (item == null)
        {
            return Result.Failure(CartErrors.ItemNotFound);
        }

        // 3. Handle deletion if quantity is 0 or less
        if (request.NewQuantity <= 0)
        {
            cart.Items.Remove(item);
        }
        else
        {
            // 4. Validate Stock
            var variant = await _variantRepository.FirstOrDefaultAsync(v => v.Id == item.VariantId, cancellationToken);
            if (variant == null)
            {
                return Result.Failure(ProductErrors.VariantNotFound);
            }

            if (!variant.IsAvailable || variant.StockQty < request.NewQuantity)
            {
                return Result.Failure(CartErrors.InsufficientStock);
            }

            item.Quantity = request.NewQuantity;
        }

        cart.UpdatedAt = DateTime.UtcNow;

        // 5. Save Changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
