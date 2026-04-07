using Microsoft.EntityFrameworkCore;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Entities.Customer;
using MusicShop.Domain.Entities.System;
using System.Reflection;

namespace MusicShop.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Table mapping according to ERD numbering

    // 1. Vai trò người dùng (System)
    public DbSet<User> Users => Set<User>();

    // 2. Catalog âm nhạc
    public DbSet<Artist> Artists => Set<Artist>();
    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<Release> Releases => Set<Release>(); // Master
    public DbSet<ReleaseVersion> ReleaseVersions => Set<ReleaseVersion>(); // Pressing
    public DbSet<Label> Labels => Set<Label>();
    public DbSet<Track> Tracks => Set<Track>();
    public DbSet<ArtistGenre> ArtistGenres => Set<ArtistGenre>();
    public DbSet<ReleaseGenre> ReleaseGenres => Set<ReleaseGenre>();

    // 3. Sản phẩm & Bán hàng (Shop)
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<VinylAttributes> VinylAttributes => Set<VinylAttributes>();
    public DbSet<CdAttributes> CdAttributes => Set<CdAttributes>();
    public DbSet<CassetteAttributes> CassetteAttributes => Set<CassetteAttributes>();
    public DbSet<CuratedCollection> CuratedCollections => Set<CuratedCollection>();
    public DbSet<CuratedCollectionItem> CuratedCollectionItems => Set<CuratedCollectionItem>();

    // 4. Quy trình đơn hàng (Orders)
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Review> Reviews => Set<Review>();

    // 5. Thanh toán
    public DbSet<Payment> Payments => Set<Payment>();

    // 6. Wantlist & Collection (Customer)
    public DbSet<WantlistItem> WantlistItems => Set<WantlistItem>();
    public DbSet<UserCollection> UserCollections => Set<UserCollection>();

    // 7. Tính năng AI
    public DbSet<AIConversation> AIConversations => Set<AIConversation>();
    public DbSet<AIMessage> AIMessages => Set<AIMessage>();
    public DbSet<Recommendation> Recommendations => Set<Recommendation>();

    // 8. Thông báo (System)
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();

    // Legacy/Extra
    public DbSet<AdminActivityLog> AdminActivityLogs => Set<AdminActivityLog>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
