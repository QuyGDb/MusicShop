using Microsoft.EntityFrameworkCore;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProducts;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Enums;
using MusicShop.Infrastructure.Persistence;

namespace MusicShop.Infrastructure.Persistence.Repositories;

public sealed class ProductRepository(AppDbContext context) : GenericRepository<Product>(context), IProductRepository
{
    public async Task<(IReadOnlyList<Product> Items, int TotalCount)> GetPagedAsync(
        GetProductsQuery request,
        CancellationToken ct = default)
    {
        IQueryable<Product> query = _dbSet.AsNoTracking()
            .Include(product => product.Variants)
            .Include(product => product.ReleaseVersion)
                .ThenInclude(releaseVersion => releaseVersion!.Release)
                    .ThenInclude(release => release!.Artist)
            .Where(product => product.IsActive)
            .AsQueryable();

        // 1. Filtering
        if (request.Format.HasValue)
        {
            query = query.Where(product => product.Format == request.Format.Value);
        }

        if (!string.IsNullOrEmpty(request.Genre))
        {
            query = query.Where(product => product.ReleaseVersion != null &&
                                     product.ReleaseVersion.Release != null &&
                                     product.ReleaseVersion.Release.ReleaseGenres.Any(releaseGenre => releaseGenre.Genre != null && releaseGenre.Genre.Slug == request.Genre));
        }

        if (request.ArtistId.HasValue)
        {
            query = query.Where(product => product.ReleaseVersion != null &&
                                     product.ReleaseVersion.Release != null &&
                                     product.ReleaseVersion.Release.ArtistId == request.ArtistId.Value);
        }

        if (request.IsLimited.HasValue)
        {
            query = query.Where(product => product.IsLimited == request.IsLimited.Value);
        }

        if (request.IsPreorder.HasValue)
        {
            query = query.Where(product => product.IsPreorder == request.IsPreorder.Value);
        }

        if (!string.IsNullOrEmpty(request.SearchQuery))
        {
            query = query.Where(product => EF.Functions.ILike(product.Name, $"%{request.SearchQuery}%"));
        }

        if (request.MinPrice.HasValue)
        {
            query = query.Where(product => product.Variants.Any(variant => variant.Price >= request.MinPrice.Value));
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(product => product.Variants.Any(variant => variant.Price <= request.MaxPrice.Value));
        }

        // 2. Execution
        int totalCount = await query.CountAsync(ct);

        List<Product> items = await query
            .OrderByDescending(product => product.CreatedAt)
            .Skip((request.Page - 1) * request.Limit)
            .Take(request.Limit)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking()
            .Include(product => product.Variants)
            .Include(product => product.ReleaseVersion)
                .ThenInclude(releaseVersion => releaseVersion!.Release)
                    .ThenInclude(release => release!.Artist)
            .FirstOrDefaultAsync(product => product.Id == id && product.IsActive, ct);
    }

    public async Task<Product?> GetBySlugWithDetailsAsync(string slug, CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking()
            .Include(product => product.Variants)
            .Include(product => product.ReleaseVersion)
                .ThenInclude(releaseVersion => releaseVersion!.Release)
                    .ThenInclude(release => release!.Artist)
            .FirstOrDefaultAsync(product => product.Slug == slug && product.IsActive, ct);
    }

    public async Task<bool> HasOrdersAsync(Guid productId, CancellationToken ct = default)
    {
        return await _context.Set<Domain.Entities.Orders.OrderItem>()
            .AnyAsync(orderItem =>
                orderItem.Variant.ProductId == productId &&
                (orderItem.Order.Status == OrderStatus.Pending || orderItem.Order.Status == OrderStatus.Confirmed),
                ct);
    }

    public async Task<IReadOnlyList<ProductVariant>> GetVariantsAsync(Guid productId, CancellationToken ct = default)
    {
        return await _context.Set<ProductVariant>()
            .AsNoTracking()
            .Include(variant => variant.VinylAttributes)
            .Include(variant => variant.CdAttributes)
            .Include(variant => variant.CassetteAttributes)
            .Where(variant => variant.ProductId == productId)
            .ToListAsync(ct);
    }

    public async Task<ProductVariant?> GetVariantByIdAsync(Guid productId, Guid variantId, CancellationToken ct = default)
    {
        return await _context.Set<ProductVariant>()
            .Include(variant => variant.Product)
            .Include(variant => variant.VinylAttributes)
            .Include(variant => variant.CdAttributes)
            .Include(variant => variant.CassetteAttributes)
            .FirstOrDefaultAsync(variant => variant.Id == variantId && variant.ProductId == productId, ct);
    }

    public void DeleteVariant(ProductVariant variant)
    {
        _context.Set<ProductVariant>().Remove(variant);
    }
}
