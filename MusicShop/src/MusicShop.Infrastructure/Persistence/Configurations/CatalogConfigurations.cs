using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MusicShop.Domain.Entities.Catalog;

namespace MusicShop.Infrastructure.Persistence.Configurations;

public class ArtistConfiguration : IEntityTypeConfiguration<Artist>
{
    public void Configure(EntityTypeBuilder<Artist> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Country)
            .HasMaxLength(100);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(x => x.Slug).IsUnique();

        // 1 Artist -> Many Releases (Master)
        builder.HasMany(x => x.Releases)
            .WithOne(x => x.Artist)
            .HasForeignKey(x => x.ArtistId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        // many-to-many via junction table
        builder.HasMany(x => x.ArtistGenres)
            .WithOne(x => x.Artist)
            .HasForeignKey(x => x.ArtistId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class GenreConfiguration : IEntityTypeConfiguration<Genre>
{
    public void Configure(EntityTypeBuilder<Genre> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(x => x.Name).IsUnique();
        builder.HasIndex(x => x.Slug).IsUnique();
    }
}

public class LabelConfiguration : IEntityTypeConfiguration<Label>
{
    public void Configure(EntityTypeBuilder<Label> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(x => x.Slug).IsUnique();

        // 1 Label -> Many ReleaseVersions
        builder.HasMany(x => x.ReleaseVersions)
            .WithOne(x => x.Label)
            .HasForeignKey(x => x.LabelId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ReleaseConfiguration : IEntityTypeConfiguration<Release>
{
    public void Configure(EntityTypeBuilder<Release> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(x => x.Year)
            .IsRequired();

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasIndex(x => x.Title);
        builder.HasIndex(x => x.Slug).IsUnique();

        // 1 Release -> Many Versions
        builder.HasMany(x => x.Versions)
            .WithOne(x => x.Release)
            .HasForeignKey(x => x.ReleaseId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        // 1 Release -> Many Tracks
        builder.HasMany(x => x.Tracks)
            .WithOne(x => x.Release)
            .HasForeignKey(x => x.ReleaseId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ReleaseVersionConfiguration : IEntityTypeConfiguration<ReleaseVersion>
{
    public void Configure(EntityTypeBuilder<ReleaseVersion> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Format)
            .HasConversion<string>();

        builder.Property(x => x.CatalogNumber)
            .HasMaxLength(100);

        builder.HasOne(x => x.Release)
            .WithMany(x => x.Versions)
            .HasForeignKey(x => x.ReleaseId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Label)
            .WithMany(x => x.ReleaseVersions)
            .HasForeignKey(x => x.LabelId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class TrackConfiguration : IEntityTypeConfiguration<Track>
{
    public void Configure(EntityTypeBuilder<Track> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(x => x.Side)
            .HasMaxLength(10);

        builder.HasOne(x => x.Release)
            .WithMany(x => x.Tracks)
            .HasForeignKey(x => x.ReleaseId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ArtistGenreConfiguration : IEntityTypeConfiguration<ArtistGenre>
{
    public void Configure(EntityTypeBuilder<ArtistGenre> builder)
    {
        builder.HasKey(x => new { x.ArtistId, x.GenreId });

        builder.HasOne(x => x.Artist)
            .WithMany(x => x.ArtistGenres)
            .HasForeignKey(x => x.ArtistId)
            .IsRequired();

        builder.HasOne(x => x.Genre)
            .WithMany(x => x.ArtistGenres)
            .HasForeignKey(x => x.GenreId)
            .IsRequired();
    }
}

public class ReleaseGenreConfiguration : IEntityTypeConfiguration<ReleaseGenre>
{
    public void Configure(EntityTypeBuilder<ReleaseGenre> builder)
    {
        builder.HasKey(x => new { x.ReleaseId, x.GenreId });

        builder.HasOne(x => x.Release)
            .WithMany(x => x.ReleaseGenres)
            .HasForeignKey(x => x.ReleaseId)
            .IsRequired();

        builder.HasOne(x => x.Genre)
            .WithMany(x => x.ReleaseGenres)
            .HasForeignKey(x => x.GenreId)
            .IsRequired();
    }
}
