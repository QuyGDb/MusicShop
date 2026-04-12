using MediatR;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProductBySlug;

public sealed record GetProductBySlugQuery(string Slug) : IRequest<Result<ProductDetailDto>>;
