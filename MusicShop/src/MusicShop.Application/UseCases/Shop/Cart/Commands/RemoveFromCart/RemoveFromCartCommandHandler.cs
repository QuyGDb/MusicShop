using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Cart.Commands.RemoveFromCart;

/// <summary>
/// Handler for RemoveFromCartCommand.
/// </summary>
public sealed class RemoveFromCartCommandHandler : IRequestHandler<RemoveFromCartCommand, Result>
{
    private readonly ICartRepository _cartRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RemoveFromCartCommandHandler(ICartRepository cartRepository, IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        // 1. Get tracked cart
        var cart = await _cartRepository.GetByUserIdForUpdateAsync(request.UserId, cancellationToken);
        if (cart == null)
        {
            return Result.Failure(CartErrors.NotFound);
        }

        // 2. Find and remove item
        var item = cart.Items.FirstOrDefault(i => i.Id == request.CartItemId);
        if (item == null)
        {
            return Result.Failure(CartErrors.ItemNotFound);
        }

        cart.Items.Remove(item);
        cart.UpdatedAt = DateTime.UtcNow;

        // 3. Save Changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
