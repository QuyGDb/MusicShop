using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Cart.Commands.AddToCart;

/// <summary>
/// Handler for AddToCartCommand.
/// Handles stock validation and cart item merging.
/// </summary>
public sealed class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, Result<Guid>>
{
    private readonly ICartRepository _cartRepository;
    private readonly IRepository<ProductVariant> _variantRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddToCartCommandHandler(
        ICartRepository cartRepository,
        IRepository<ProductVariant> variantRepository,
        IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _variantRepository = variantRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        // 1. Validate Product Variant & Stock
        var variant = await _variantRepository.FirstOrDefaultAsync(v => v.Id == request.ProductVariantId, cancellationToken);
        if (variant == null)
        {
            return Result<Guid>.Failure(ProductErrors.VariantNotFound);
        }

        if (!variant.IsAvailable || variant.StockQty < request.Quantity)
        {
            return Result<Guid>.Failure(CartErrors.InsufficientStock);
        }

        // 2. Get or Create Cart (Tracked)
        var cart = await _cartRepository.GetByUserIdForUpdateAsync(request.UserId, cancellationToken);
        if (cart == null)
        {
            cart = new Domain.Entities.Orders.Cart
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };
            cart.Touch();
            _cartRepository.Add(cart);
        }

        // 3. Add or Update Item
        var existingItem = cart.Items.FirstOrDefault(i => i.VariantId == request.ProductVariantId);
        if (existingItem != null)
        {
            int newQuantity = existingItem.Quantity + request.Quantity;
            if (variant.StockQty < newQuantity)
            {
                return Result<Guid>.Failure(CartErrors.InsufficientStock);
            }
            existingItem.Quantity = newQuantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                VariantId = request.ProductVariantId,
                Quantity = request.Quantity
            });
        }

        cart.Touch();

        // 4. Persistence
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(cart.Id);
    }
}
