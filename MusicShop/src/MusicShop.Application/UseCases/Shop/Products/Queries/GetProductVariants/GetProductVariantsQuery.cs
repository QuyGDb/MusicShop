using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProductVariants;

public sealed record GetProductVariantsQuery(Guid ProductId) : IRequest<Result<IReadOnlyList<ProductVariantDto>>>;
