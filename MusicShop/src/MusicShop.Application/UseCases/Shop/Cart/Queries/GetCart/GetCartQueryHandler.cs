using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.Common.Mappings;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Shop.Cart.Queries.GetCart;

/// <summary>
/// Handler for GetCartQuery.
/// Retrieves or creates a shopping cart for the specified user.
/// </summary>
public sealed class GetCartQueryHandler : IRequestHandler<GetCartQuery, Result<CartDto>>
{
    private readonly ICartRepository _cartRepository;
    private readonly IUnitOfWork _unitOfWork;

    public GetCartQueryHandler(ICartRepository cartRepository, IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<CartDto>> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserIdAsync(request.UserId, cancellationToken);

        if (cart == null)
        {
            // If cart doesn't exist, create an empty one for the user
            var newCart = new Domain.Entities.Orders.Cart
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };
            
            newCart.Touch();
            
            _cartRepository.Add(newCart);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result<CartDto>.Success(newCart.ToDto());
        }

        return Result<CartDto>.Success(cart.ToDto());
    }
}
