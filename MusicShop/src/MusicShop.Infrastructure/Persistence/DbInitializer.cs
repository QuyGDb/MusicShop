using Microsoft.EntityFrameworkCore;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicShop.Infrastructure.Persistence;

/// <summary>
/// Handles initial database seeding with manual data generation.
/// </summary>
public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context, IPasswordHasher passwordHasher)
    {
        // 0. Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // 0.5. Seed Admin User if not exists
        if (!await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@musicshop.com",
                FullName = "System Admin",
                PasswordHash = passwordHasher.Hash("Admin@123"),
                Role = UserRole.Admin,
                IdentityProvider = "Local"
            };
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        // Check if seeding is needed (we use Genres as a marker)
        if (await context.Genres.AnyAsync())
        {
            return;
        }

        var random = new Random(42);

        // 1. Seed Genres
        var genreNames = new[] { "Rock", "Jazz", "Electronic", "Classical", "Pop", "Metal", "Indie", "Hip Hop", "Soul", "Blues" };
        var genres = genreNames.Select(name => new Genre
        {
            Id = Guid.NewGuid(),
            Name = name,
            Slug = name.ToLower().Replace(" ", "-"),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        }).ToList();
        await context.Genres.AddRangeAsync(genres);

        // 2. Seed Artists
        var artistNames = new[] 
        { 
            "The Midnight Echo", "Solar Flare", "Luna Blue", "Electric Dreams", "Velvet Underground", 
            "Neon Nights", "Aether", "Crystal Castles", "Deep Sea Diver", "Echo Park",
            "Fever Ray", "Ghost Poet", "Hollow Coves", "Iron & Wine", "Jade Bird",
            "King Krule", "Lord Huron", "Mt. Joy", "Night Tapes", "Ocean Alley"
        };
        
        var artists = artistNames.Select(name => new Artist
        {
            Id = Guid.NewGuid(),
            Name = name,
            Slug = name.ToLower().Replace(" ", "-") + "-" + random.Next(100, 999),
            Bio = $"A unique and experimental musical project exploring the depths of {name.ToLower()} sounds and rhythms. Formed in recent years, they have quickly gained a following for their innovative approach to production and performance.",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        }).ToList();
        await context.Artists.AddRangeAsync(artists);

        // 3. Seed Labels
        var labelNames = new[] 
        { 
            "Blue Note", "Warp", "Domino", "4AD", "Sub Pop", 
            "XL Recordings", "Ninja Tune", "Mute", "Rough Trade", "Matador" 
        };
        var countries = new[] { "USA", "UK", "Germany", "France", "Japan", "Canada", "Australia" };

        var labels = labelNames.Select(name => new Label
        {
            Id = Guid.NewGuid(),
            Name = name + " Records",
            Slug = name.ToLower().Replace(" ", "-"),
            Country = countries[random.Next(countries.Length)],
            FoundedYear = random.Next(1950, 2015),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        }).ToList();
        await context.Labels.AddRangeAsync(labels);

        // 4. Seed Releases (Albums)
        var releases = new List<Release>();
        var releaseVersions = new List<ReleaseVersion>();
        var products = new List<Product>();
        var productVariants = new List<ProductVariant>();

        var albumAdjectives = new[] { "Mystic", "Electric", "Silent", "Golden", "Dark", "Neon", "Ethereal", "Lost", "Infinite", "Ancient" };
        var albumNouns = new[] { "Dreams", "Nights", "Horizon", "Echoes", "Light", "Shadow", "Soul", "Voyage", "Heart", "City" };
        
        var albumCovers = new[] {
            "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1514525253344-f8576996a63f?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800&auto=format&fit=crop"
        };

        foreach (var artist in artists)
        {
            // Each artist has 2 albums
            int albumCount = 2;
            for (int i = 0; i < albumCount; i++)
            {
                var title = albumAdjectives[random.Next(albumAdjectives.Length)] + " " + albumNouns[random.Next(albumNouns.Length)];
                var release = new Release
                {
                    Id = Guid.NewGuid(),
                    Title = title,
                    Year = random.Next(1970, 2024),
                    Description = $"A critically acclaimed album by {artist.Name}, featuring a blend of atmospheric melodies and driving rhythms.",
                    CoverUrl = albumCovers[random.Next(albumCovers.Length)],
                    ArtistId = artist.Id,
                    Type = "Album",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                release.Slug = release.Title.ToLower().Replace(" ", "-") + "-" + random.Next(1000, 9999);
                releases.Add(release);

                // For each album, create versions (Vinyl and/or CD)
                var formats = new[] { ReleaseFormat.Vinyl, ReleaseFormat.CD };
                foreach (var format in formats)
                {
                    var label = labels[random.Next(labels.Count)];
                    var version = new ReleaseVersion
                    {
                        Id = Guid.NewGuid(),
                        ReleaseId = release.Id,
                        LabelId = label.Id,
                        Format = format,
                        CatalogNumber = $"MS-{random.Next(10000, 99999)}",
                        PressingCountry = countries[random.Next(countries.Length)],
                        PressingYear = release.Year + random.Next(0, 3),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    releaseVersions.Add(version);

                    // Create Shop Product for this version
                    var product = new Product
                    {
                        Id = Guid.NewGuid(),
                        Name = release.Title + " [" + format.ToString() + "]",
                        Slug = release.Slug + "-" + format.ToString().ToLower(),
                        Description = release.Description,
                        CoverUrl = release.CoverUrl,
                        Format = format,
                        ReleaseVersionId = version.Id,
                        IsActive = true,
                        IsLimited = random.NextDouble() < 0.2,
                        IsPreorder = release.Year > 2023,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    products.Add(product);

                    // Create standard Variant for the product
                    var variant = new ProductVariant
                    {
                        Id = Guid.NewGuid(),
                        ProductId = product.Id,
                        VariantName = format == ReleaseFormat.Vinyl ? "Black 180g Vinyl" : "Standard CD",
                        Price = format == ReleaseFormat.Vinyl ? (decimal)(random.NextDouble() * 20 + 25) : (decimal)(random.NextDouble() * 10 + 12),
                        StockQty = random.Next(0, 50),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    productVariants.Add(variant);
                }
            }
        }

        await context.Releases.AddRangeAsync(releases);
        await context.ReleaseVersions.AddRangeAsync(releaseVersions);
        await context.Products.AddRangeAsync(products);
        await context.ProductVariants.AddRangeAsync(productVariants);

        // 5. Final Save
        await context.SaveChangesAsync();
    }
}
