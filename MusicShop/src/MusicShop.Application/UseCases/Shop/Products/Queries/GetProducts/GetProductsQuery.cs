using MediatR;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Application.UseCases.Shop.Products.Queries.GetProducts;

/// <summary>
/// Query to retrieve a paged list of products with optional filtering
/// </summary>
public sealed record GetProductsQuery : IRequest<Result<PaginatedResult<ProductListItemDto>>>
{
    public ReleaseFormat? Format { get; init; }
    public string? Genre { get; init; }
    public Guid? ArtistId { get; init; }
    public bool? IsLimited { get; init; }
    public bool? IsPreorder { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public string? SearchQuery { get; init; }
    public bool? IsActive { get; init; }
    
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
