using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProducts;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Enums;
using MusicShop.Infrastructure.Persistence;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<(IReadOnlyList<Product> Items, int TotalCount)> GetPagedAsync(
        GetProductsQuery request,
        CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking()
            .Include(p => p.Variants)
            .Include(p => p.ReleaseVersion)
                .ThenInclude(rv => rv!.Release)
                    .ThenInclude(r => r!.Artist)
            .Where(p => p.IsActive)
            .AsQueryable();

        // 1. Filtering
        if (request.Format.HasValue)
        {
            query = query.Where(p => p.Format == request.Format.Value);
        }

        if (!string.IsNullOrEmpty(request.Genre))
        {
            query = query.Where(p => p.ReleaseVersion != null && 
                                     p.ReleaseVersion.Release != null && 
                                     p.ReleaseVersion.Release.ReleaseGenres.Any(rg => rg.Genre != null && rg.Genre.Slug == request.Genre));
        }

        if (request.ArtistId.HasValue)
        {
            query = query.Where(p => p.ReleaseVersion != null && 
                                     p.ReleaseVersion.Release != null && 
                                     p.ReleaseVersion.Release.ArtistId == request.ArtistId.Value);
        }

        if (request.IsLimited.HasValue)
        {
            query = query.Where(p => p.IsLimited == request.IsLimited.Value);
        }

        if (request.IsPreorder.HasValue)
        {
            query = query.Where(p => p.IsPreorder == request.IsPreorder.Value);
        }

        if (!string.IsNullOrEmpty(request.SearchQuery))
        {
            query = query.Where(p => EF.Functions.ILike(p.Name, $"%{request.SearchQuery}%"));
        }

        if (request.MinPrice.HasValue)
        {
            query = query.Where(p => p.Variants.Any(v => v.Price >= request.MinPrice.Value));
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Variants.Any(v => v.Price <= request.MaxPrice.Value));
        }

        // 2. Execution
        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.Limit)
            .Take(request.Limit)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking()
            .Include(p => p.Variants)
            .Include(p => p.ReleaseVersion)
                .ThenInclude(rv => rv!.Release)
                    .ThenInclude(r => r!.Artist)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive, ct);
    }

    public async Task<Product?> GetBySlugWithDetailsAsync(string slug, CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking()
            .Include(p => p.Variants)
            .Include(p => p.ReleaseVersion)
                .ThenInclude(rv => rv!.Release)
                    .ThenInclude(r => r!.Artist)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, ct);
    }

    public async Task<bool> HasOrdersAsync(Guid productId, CancellationToken ct = default)
    {
        return await _context.Set<Domain.Entities.Orders.OrderItem>()
            .AnyAsync(oi =>
                oi.Variant.ProductId == productId &&
                (oi.Order.Status == OrderStatus.Pending || oi.Order.Status == OrderStatus.Confirmed),
                ct);
    }

    public async Task<IReadOnlyList<ProductVariant>> GetVariantsAsync(Guid productId, CancellationToken ct = default)
    {
        return await _context.Set<ProductVariant>()
            .AsNoTracking()
            .Include(v => v.VinylAttributes)
            .Include(v => v.CdAttributes)
            .Include(v => v.CassetteAttributes)
            .Where(v => v.ProductId == productId)
            .ToListAsync(ct);
    }

    public async Task<ProductVariant?> GetVariantByIdAsync(Guid productId, Guid variantId, CancellationToken ct = default)
    {
        return await _context.Set<ProductVariant>()
            .Include(v => v.VinylAttributes)
            .Include(v => v.CdAttributes)
            .Include(v => v.CassetteAttributes)
            .FirstOrDefaultAsync(v => v.Id == variantId && v.ProductId == productId, ct);
    }

    public void DeleteVariant(ProductVariant variant)
    {
        _context.Set<ProductVariant>().Remove(variant);
    }
}

