using MusicShop.Application.DTOs.Catalog;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Entities.Orders;
using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Enums;

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
            Slug = label.Slug,
            Country = label.Country,
            FoundedYear = label.FoundedYear,
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
            Slug = artist.Slug,
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
            Slug = release.Slug,
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
            Slug = release.Slug,
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
        return new ReleaseVersionDto
        {
            Id = version.Id,
            Format = version.Format.ToString(),
            PressingCountry = version.PressingCountry,
            PressingYear = version.PressingYear,
            CatalogNumber = version.CatalogNumber,
            LabelName = version.Label?.Name ?? string.Empty,
            Notes = version.Notes,
            Price = version.Products.OrderBy(p => p.Price).Select(p => (decimal?)p.Price).FirstOrDefault(),
            StockQty = version.Products.Sum(p => p.StockQty),
            ImageUrl = version.Products.FirstOrDefault()?.CoverUrl
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

    // Curated Collections
    public static CuratedCollectionFeaturedResponse ToFeaturedResponse(this CuratedCollection collection)
    {
        return new CuratedCollectionFeaturedResponse(
            collection.Id,
            collection.Title,
            collection.Description,
            collection.Items
                .OrderBy(i => i.SortOrder)
                .Select(i => i.ToFeaturedItemResponse())
                .ToList());
    }

    public static CuratedCollectionFeaturedItemResponse ToFeaturedItemResponse(this CuratedCollectionItem item)
    {
        return new CuratedCollectionFeaturedItemResponse(
            item.ProductId,
            item.Product.ReleaseVersion?.Release.Title ?? "Unknown",
            item.Product.ReleaseVersion?.Release.Artist.Name ?? "Unknown Artist",
            item.Product.Price,
            item.Product.ReleaseVersion?.Release.CoverUrl ?? string.Empty,
            item.Product.Slug,
            item.SortOrder);
    }

    // Carts
    public static CartDto ToDto(this Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            UpdatedAt = cart.UpdatedAt,
            Items = cart.Items.Select(cartItem => new CartItemDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                ProductName = cartItem.Product?.Name ?? "Unknown Product",
                CoverUrl = cartItem.Product?.CoverUrl,
                UnitPrice = cartItem.Product?.Price ?? 0,
                InStock = (cartItem.Product?.StockQty ?? 0) >= cartItem.Quantity
            }).ToList()
        };
    }

    // Products
    public static ProductListItemDto ToListItemDto(this Product product)
    {
        return new ProductListItemDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            ArtistName = product.ReleaseVersion?.Release?.Artist?.Name,
            Format = product.ReleaseVersion != null ? product.ReleaseVersion.Format : ReleaseFormat.Vinyl,
            IsLimited = product.IsLimited,
            IsPreorder = product.IsPreorder,
            CoverUrl = product.CoverUrl,
            Price = product.Price,
            StockQty = product.StockQty,
            InStock = product.StockQty > 0 && product.IsAvailable,
            IsActive = product.IsActive
        };
    }

    public static ProductDetailDto ToDetailDto(this Product product)
    {
        return new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Format = product.ReleaseVersion != null ? product.ReleaseVersion.Format : ReleaseFormat.Vinyl,
            IsLimited = product.IsLimited,
            LimitedQty = product.LimitedQty,
            IsPreorder = product.IsPreorder,
            PreorderReleaseDate = product.PreorderReleaseDate,
            CoverUrl = product.CoverUrl,
            Artist = new ArtistShortDto
            {
                Id = product.ReleaseVersion?.Release?.ArtistId ?? Guid.Empty,
                Name = product.ReleaseVersion?.Release?.Artist?.Name ?? string.Empty
            },
            Price = product.Price,
            StockQty = product.StockQty,
            IsAvailable = product.IsAvailable,
            IsSigned = product.IsSigned,
            VinylAttributes = product.VinylAttributes != null ? new VinylAttributesDto(
                product.VinylAttributes.DiscColor,
                product.VinylAttributes.WeightGrams,
                product.VinylAttributes.SpeedRpm,
                product.VinylAttributes.DiscCount,
                product.VinylAttributes.SleeveType) : null,
            CdAttributes = product.CdAttributes != null ? new CdAttributesDto(
                product.CdAttributes.Edition,
                product.CdAttributes.IsJapanEdition) : null,
            CassetteAttributes = product.CassetteAttributes != null ? new CassetteAttributesDto(
                product.CassetteAttributes.TapeColor,
                product.CassetteAttributes.Edition) : null
        };
    }
}
