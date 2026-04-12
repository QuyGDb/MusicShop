using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.DeactivateProduct;

public sealed record DeactivateProductCommand(Guid Id) : IRequest<Result>;
