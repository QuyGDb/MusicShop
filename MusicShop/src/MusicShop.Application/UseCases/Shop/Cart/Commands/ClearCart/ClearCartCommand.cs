using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Cart.Commands.ClearCart;

public sealed record ClearCartCommand : IRequest<Result>;
