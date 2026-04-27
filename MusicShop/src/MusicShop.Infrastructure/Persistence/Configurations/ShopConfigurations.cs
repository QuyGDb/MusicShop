using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasIndex(x => x.Name);
        builder.HasIndex(x => x.Slug).IsUnique();

        builder.Property(x => x.Price)
            .HasPrecision(18, 2);

        // Extensions 1-1
        builder.HasOne(x => x.VinylAttributes)
            .WithOne(x => x.Product)
            .HasForeignKey<VinylAttributes>(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.CdAttributes)
            .WithOne(x => x.Product)
            .HasForeignKey<CdAttributes>(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.CassetteAttributes)
            .WithOne(x => x.Product)
            .HasForeignKey<CassetteAttributes>(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Linked to ReleaseVersion (Pressing)
        builder.HasOne(x => x.ReleaseVersion)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.ReleaseVersionId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}


public class VinylAttributesConfiguration : IEntityTypeConfiguration<VinylAttributes>
{
    public void Configure(EntityTypeBuilder<VinylAttributes> builder)
    {
        builder.HasKey(x => x.Id);
        builder.ToTable("vinyl_attributes");
    }
}

public class CdAttributesConfiguration : IEntityTypeConfiguration<CdAttributes>
{
    public void Configure(EntityTypeBuilder<CdAttributes> builder)
    {
        builder.HasKey(x => x.Id);
        builder.ToTable("cd_attributes");
    }
}

public class CassetteAttributesConfiguration : IEntityTypeConfiguration<CassetteAttributes>
{
    public void Configure(EntityTypeBuilder<CassetteAttributes> builder)
    {
        builder.HasKey(x => x.Id);
        builder.ToTable("cassette_attributes");
    }
}

public class CuratedCollectionConfiguration : IEntityTypeConfiguration<CuratedCollection>
{
    public void Configure(EntityTypeBuilder<CuratedCollection> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasMany(x => x.Items)
            .WithOne(x => x.Collection)
            .HasForeignKey(x => x.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CuratedCollectionItemConfiguration : IEntityTypeConfiguration<CuratedCollectionItem>
{
    public void Configure(EntityTypeBuilder<CuratedCollectionItem> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Product)
            .WithMany(x => x.CollectionItems)
            .HasForeignKey(x => x.ProductId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}

