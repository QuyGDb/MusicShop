using System.ComponentModel.DataAnnotations;

namespace MusicShop.Infrastructure.Security;

public sealed class JwtSettings
{
    public const string SectionName = "JwtSettings";

    [Required, MinLength(32)]
    public string Secret { get; set; } = string.Empty;

    [Required]
    public string Issuer { get; set; } = string.Empty;

    [Required]
    public string Audience { get; set; } = string.Empty;

    [Range(1, 1440)]
    public int ExpiryMinutes { get; set; }

    [Range(1, 90)]
    public int RefreshTokenDays { get; set; }

    [Range(0, 300)]
    public int RefreshTokenGracePeriodSeconds { get; set; } = 60;
}
