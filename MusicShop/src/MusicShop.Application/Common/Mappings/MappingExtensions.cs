using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Entities.System;

namespace MusicShop.Application.Common.Mappings;

public static class MappingExtensions
{
    // Genres
    public static GenreResponse ToResponse(this Genre genre)
    {
        return new GenreResponse
        {
            Id = genre.Id,
            Name = genre.Name,
            Slug = genre.Slug
        };
    }

    // Labels
    public static LabelResponse ToResponse(this Label label)
    {
        return new LabelResponse
        {
            Id = label.Id,
            Name = label.Name,
            Country = label.Country,
            Website = label.Website
        };
    }

    // Artists
    public static ArtistResponse ToResponse(this Artist artist)
    {
        return new ArtistResponse
        {
            Id = artist.Id,
            Name = artist.Name,
            Bio = artist.Bio,
            Country = artist.Country,
            ImageUrl = artist.ImageUrl,
            Genres = artist.ArtistGenres.Select(ag => ag.Genre.ToResponse()).ToList()
        };
    }

    // Releases
    public static ReleaseResponse ToResponse(this Release release)
    {
        return new ReleaseResponse
        {
            Id = release.Id,
            Title = release.Title,
            Year = release.Year,
            CoverUrl = release.CoverUrl,
            Description = release.Description,
            ArtistId = release.ArtistId,
            ArtistName = release.Artist?.Name ?? string.Empty,
            Genres = release.ReleaseGenres.Select(rg => rg.Genre.ToResponse()).ToList()
        };
    }

    public static ReleaseDetailResponse ToDetailResponse(this Release release)
    {
        return new ReleaseDetailResponse
        {
            Id = release.Id,
            Title = release.Title,
            Year = release.Year,
            CoverUrl = release.CoverUrl,
            Description = release.Description,
            ArtistId = release.ArtistId,
            ArtistName = release.Artist?.Name ?? string.Empty,
            Artist = release.Artist!.ToResponse(),
            Genres = release.ReleaseGenres.Select(rg => rg.Genre.ToResponse()).ToList(),
            Tracks = release.Tracks.OrderBy(t => t.Position).Select(t => t.ToDto()).ToList(),
            Versions = release.Versions.Select(v => v.ToDto()).ToList()
        };
    }

    // Release Versions
    public static ReleaseVersionDto ToDto(this ReleaseVersion version)
    {
        List<ProductVariant> variants = version.Products.SelectMany(p => p.Variants).ToList();

        return new ReleaseVersionDto
        {
            Id = version.Id,
            Format = version.Format.ToString(),
            PressingCountry = version.PressingCountry,
            PressingYear = version.PressingYear,
            CatalogNumber = version.CatalogNumber,
            LabelName = version.Label?.Name ?? string.Empty,
            Notes = version.Notes,
            Price = variants.OrderBy(v => v.Price).Select(v => (decimal?)v.Price).FirstOrDefault(),
            StockQty = variants.Sum(v => (int?)v.StockQty) ?? 0
        };
    }

    // Tracks
    public static TrackDto ToDto(this Track track)
    {
        return new TrackDto
        {
            Id = track.Id,
            Title = track.Title,
            Position = track.Position,
            DurationSeconds = track.DurationSeconds,
            Side = track.Side
        };
    }

    // Users
    public static UserResponse ToResponse(this User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt
        };
    }

    public static AuthResponse ToAuthResponse(
        this User user, 
        string accessToken, 
        string refreshToken, 
        DateTime accessTokenExpiresAtUtc)
    {
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt = accessTokenExpiresAtUtc,
            User = user.ToResponse()
        };
    }
}
