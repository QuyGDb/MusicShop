using Microsoft.EntityFrameworkCore;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Enums;
using MusicShop.Domain.Interfaces;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using System.Reflection;

namespace MusicShop.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context, IPasswordHasher passwordHasher)
    {
        await context.Database.EnsureCreatedAsync();

        // 1. Seed Admin
        if (!await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            var adminUser = new User
            {
                Email = "admin@musicshop.com",
                FullName = "System Admin",
                PasswordHash = passwordHasher.Hash("Admin@123"),
                Role = UserRole.Admin,
                IdentityProvider = "Local"
            };
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        // 2. Seed Genres
        if (!await context.Genres.AnyAsync())
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "MusicShop.Infrastructure.Persistence.SeedData.genres.csv";

            using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null) throw new FileNotFoundException("Seed data file not found", resourceName);

            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true
            });

            var records = csv.GetRecords<dynamic>();
            List<Genre> genres = new();

            foreach (var record in records)
            {
                genres.Add(new Genre
                {
                    Name = record.Name,
                    Slug = record.Slug
                });
            }

            await context.Genres.AddRangeAsync(genres);
            await context.SaveChangesAsync();
        }

        // 3. Seed Artists
        if (!await context.Artists.AnyAsync())
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "MusicShop.Infrastructure.Persistence.SeedData.artists.csv";

            using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null) throw new FileNotFoundException("Seed data file not found", resourceName);

            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                MissingFieldFound = null
            });

            var records = csv.GetRecords<dynamic>();
            var genresMap = await context.Genres.ToDictionaryAsync(g => g.Name);

            List<Artist> artists = new();

            foreach (var record in records)
            {
                var artist = new Artist
                {
                    Name = record.Name,
                    Bio = record.Bio,
                    Country = record.Country,
                    Slug = Slugify(record.Name)
                };

                // Link genres via navigation property
                string genresStr = record.Genres ?? string.Empty;
                var artistGenreNames = genresStr.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                              .Select(g => g.Trim());

                foreach (var genreName in artistGenreNames)
                {
                    if (genresMap.TryGetValue(genreName, out var genre))
                    {
                        artist.ArtistGenres.Add(new ArtistGenre
                        {
                            Genre = genre
                        });
                    }
                }

                artists.Add(artist);
            }

            await context.Artists.AddRangeAsync(artists);
        }

        await context.SaveChangesAsync();

        // 4. Seed Labels
        if (!await context.Labels.AnyAsync())
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "MusicShop.Infrastructure.Persistence.SeedData.labels.csv";

            using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null) throw new FileNotFoundException("Seed data file not found", resourceName);

            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                MissingFieldFound = null
            });

            var records = csv.GetRecords<dynamic>();
            List<Label> labels = new();

            foreach (var record in records)
            {
                labels.Add(new Label
                {
                    Name = record.Name,
                    Slug = record.Slug,
                    Country = record.Country,
                    FoundedYear = int.TryParse(record.FoundedYear?.ToString(), out int year) ? year : null,
                    Website = record.Website
                });
            }

            await context.Labels.AddRangeAsync(labels);
        }

        await context.SaveChangesAsync();

        // 5. Seed Releases
        if (!await context.Releases.AnyAsync())
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "MusicShop.Infrastructure.Persistence.SeedData.releases.csv";

            using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null) throw new FileNotFoundException("Seed data file not found", resourceName);

            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                MissingFieldFound = null
            });

            var records = csv.GetRecords<dynamic>().ToList();
            var artistsMap = await context.Artists.ToDictionaryAsync(a => a.Name);
            var genresMap = await context.Genres.ToDictionaryAsync(g => g.Name);

            List<Release> releases = new();

            foreach (var record in records)
            {
                string artistName = record.ArtistName ?? string.Empty;
                if (!artistsMap.TryGetValue(artistName, out var artist)) continue;

                var release = new Release
                {
                    Title = record.Title,
                    Slug = record.Slug,
                    Year = int.TryParse(record.Year?.ToString(), out int year) ? year : 0,
                    Description = record.Description,
                    Artist = artist
                };

                // Link genres via navigation property
                string genresStr = record.Genres ?? string.Empty;
                var releaseGenreNames = genresStr.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                                 .Select(g => g.Trim());

                foreach (var genreName in releaseGenreNames)
                {
                    if (genresMap.TryGetValue(genreName, out var genre))
                    {
                        release.ReleaseGenres.Add(new ReleaseGenre
                        {
                            Genre = genre
                        });
                    }
                }

                releases.Add(release);
            }

            await context.Releases.AddRangeAsync(releases);
        }

        await context.SaveChangesAsync();

        // 6. Seed ReleaseVersions
        if (!await context.ReleaseVersions.AnyAsync())
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "MusicShop.Infrastructure.Persistence.SeedData.release_versions.csv";

            using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null) throw new FileNotFoundException("Seed data file not found", resourceName);

            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                MissingFieldFound = null
            });

            var records = csv.GetRecords<dynamic>().ToList();
            var releasesMap = await context.Releases.ToDictionaryAsync(r => r.Title);
            var labelsMap = await context.Labels.ToDictionaryAsync(l => l.Name);

            List<ReleaseVersion> versions = new();

            foreach (var record in records)
            {
                string releaseTitle = record.ReleaseTitle ?? string.Empty;
                string labelName = record.LabelName ?? string.Empty;

                if (!releasesMap.TryGetValue(releaseTitle, out var release)) continue;
                if (!labelsMap.TryGetValue(labelName, out var label)) continue;

                versions.Add(new ReleaseVersion
                {
                    Name = record.VersionName,
                    Release = release,
                    Label = label,
                    Format = Enum.TryParse<ReleaseFormat>(record.Format?.ToString(), out ReleaseFormat format) ? format : ReleaseFormat.Vinyl,
                    PressingCountry = record.PressingCountry,
                    PressingYear = int.TryParse(record.PressingYear?.ToString(), out int year) ? year : null,
                    CatalogNumber = record.CatalogNumber,
                    Notes = record.Notes
                });
            }

            await context.ReleaseVersions.AddRangeAsync(versions);
        }

        await context.SaveChangesAsync();
    }

    private static string Slugify(string text)
    {
        if (string.IsNullOrEmpty(text)) return string.Empty;

        return text.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace(".", "")
            .Replace("'", "")
            .Replace("(", "")
            .Replace(")", "")
            .Replace("&", "and")
            .Replace(",", "")
            .Trim('-');
    }
}
