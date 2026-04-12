using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Commands.DeleteProductVariant;

public sealed record DeleteProductVariantCommand(Guid ProductId, Guid VariantId) : IRequest<Result>;
