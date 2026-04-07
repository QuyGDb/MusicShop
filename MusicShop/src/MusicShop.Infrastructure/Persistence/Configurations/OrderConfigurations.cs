using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MusicShop.Domain.Entities.Orders;

namespace MusicShop.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Status)
            .HasConversion<string>();

        builder.Property(x => x.TotalAmount)
            .HasPrecision(18, 2);

        builder.Property(x => x.ShippingName).IsRequired().HasMaxLength(200);
        builder.Property(x => x.ShippingPhone).IsRequired().HasMaxLength(20);
        builder.Property(x => x.ShippingAddress).IsRequired().HasMaxLength(500);

        // 1 Order -> Many OrderItems
        builder.HasMany(x => x.OrderItems)
            .WithOne(x => x.Order)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // 1 Order -> 1 Payment
        builder.HasOne(x => x.Payment)
            .WithOne(x => x.Order)
            .HasForeignKey<Payment>(x => x.OrderId);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.PriceSnapshot)
            .HasPrecision(18, 2);

        builder.Property(x => x.ProductNameSnapshot)
            .IsRequired()
            .HasMaxLength(300);
    }
}

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.HasIndex(x => x.UserId).IsUnique();

        // 1 Cart -> Many Items
        builder.HasMany(x => x.Items)
            .WithOne(x => x.Cart)
            .HasForeignKey(x => x.CartId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Amount)
            .HasPrecision(18, 2);

        builder.Property(x => x.Status).HasConversion<string>();
        builder.Property(x => x.Gateway).HasConversion<string>();
    }
}
