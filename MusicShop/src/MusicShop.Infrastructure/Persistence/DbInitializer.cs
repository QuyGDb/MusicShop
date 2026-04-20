using Bogus;
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
/// Handles initial database seeding with realistic mock data using Bogus.
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

        // Set up Faker
        Randomizer.Seed = new Random(42); // Deterministic seeds for consistency
        var faker = new Faker();

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
        var artistFaker = new Faker<Artist>()
            .RuleFor(a => a.Id, f => Guid.NewGuid())
            .RuleFor(a => a.Name, f => f.Person.FullName)
            .RuleFor(a => a.Slug, (f, a) => a.Name.ToLower().Replace(" ", "-") + "-" + f.Random.Int(100, 999))
            .RuleFor(a => a.Bio, f => f.Lorem.Paragraph())
            .RuleFor(a => a.CreatedAt, f => DateTime.UtcNow)
            .RuleFor(a => a.UpdatedAt, f => DateTime.UtcNow);

        var artists = artistFaker.Generate(20);
        await context.Artists.AddRangeAsync(artists);

        // 3. Seed Labels
        var labelFaker = new Faker<Label>()
            .RuleFor(l => l.Id, f => Guid.NewGuid())
            .RuleFor(l => l.Name, f => f.Company.CompanyName() + " Records")
            .RuleFor(l => l.Slug, (f, l) => l.Name.ToLower().Replace(" ", "-").Replace(",", ""))
            .RuleFor(l => l.Country, f => f.Address.Country())
            .RuleFor(l => l.FoundedYear, f => f.Random.Int(1950, 2010))
            .RuleFor(l => l.CreatedAt, f => DateTime.UtcNow)
            .RuleFor(l => l.UpdatedAt, f => DateTime.UtcNow);

        var labels = labelFaker.Generate(10);
        await context.Labels.AddRangeAsync(labels);

        // 4. Seed Releases (Albums)
        var releases = new List<Release>();
        var releaseVersions = new List<ReleaseVersion>();
        var products = new List<Product>();
        var productVariants = new List<ProductVariant>();

        var albumCovers = new[] {
            "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1514525253344-f8576996a63f?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800&auto=format&fit=crop"
        };

        foreach (var artist in artists)
        {
            // Each artist has 2-3 albums
            int albumCount = faker.Random.Int(2, 3);
            for (int i = 0; i < albumCount; i++)
            {
                var title = faker.Commerce.ProductAdjective() + " " + faker.Commerce.ProductName();
                var release = new Release
                {
                    Id = Guid.NewGuid(),
                    Title = title,
                    Year = faker.Random.Int(1970, 2024),
                    Description = faker.Lorem.Sentence(10),
                    CoverUrl = faker.PickRandom(albumCovers),
                    ArtistId = artist.Id,
                    Type = "Album",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                release.Slug = release.Title.ToLower().Replace(" ", "-") + "-" + faker.Random.Int(1000, 9999);
                releases.Add(release);

                // For each album, create versions (Vinyl and/or CD)
                var formats = new[] { ReleaseFormat.Vinyl, ReleaseFormat.CD };
                foreach (var format in formats)
                {
                    var label = faker.PickRandom(labels);
                    var version = new ReleaseVersion
                    {
                        Id = Guid.NewGuid(),
                        ReleaseId = release.Id,
                        LabelId = label.Id,
                        Format = format,
                        CatalogNumber = faker.Random.AlphaNumeric(8).ToUpper(),
                        PressingCountry = faker.Address.Country(),
                        PressingYear = release.Year + faker.Random.Int(0, 2),
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
                        IsLimited = faker.Random.Bool(0.2f),
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
                        Price = format == ReleaseFormat.Vinyl ? faker.Random.Decimal(25, 45) : faker.Random.Decimal(12, 22),
                        StockQty = faker.Random.Int(0, 50),
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
