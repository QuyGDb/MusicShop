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
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddToCartCommandHandler(
        ICartRepository cartRepository,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        // 1. Validate Product & Stock
        Product? product = await _productRepository.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
        if (product == null)
        {
            return Result<Guid>.Failure(ProductErrors.NotFound);
        }

        if (!product.IsAvailable || product.StockQty < request.Quantity)
        {
            return Result<Guid>.Failure(CartErrors.InsufficientStock);
        }

        // 2. Get or Create Cart (Tracked)
        Domain.Entities.Orders.Cart? cart = await _cartRepository.GetByUserIdForUpdateAsync(request.UserId, cancellationToken);
        if (cart == null)
        {
            cart = new Domain.Entities.Orders.Cart
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };
            cart.UpdatedAt = DateTime.UtcNow;
            _cartRepository.Add(cart);
        }

        // 3. Add or Update Item
        CartItem? existingCartItem = cart.Items.FirstOrDefault(item => item.ProductId == request.ProductId);
        if (existingCartItem != null)
        {
            int newQuantity = existingCartItem.Quantity + request.Quantity;
            if (product.StockQty < newQuantity)
            {
                return Result<Guid>.Failure(CartErrors.InsufficientStock);
            }
            existingCartItem.Quantity = newQuantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;

        // 4. Persistence
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(cart.Id);
    }
}
