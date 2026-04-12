using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProductById;

/// <summary>
/// Query to retrieve full product details by unique identifier
/// </summary>
public sealed record GetProductByIdQuery(Guid Id) : IRequest<Result<ProductDetailDto>>;
