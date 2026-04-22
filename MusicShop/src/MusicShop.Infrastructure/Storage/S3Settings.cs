using System.ComponentModel.DataAnnotations;

namespace MusicShop.Infrastructure.Storage;

public sealed record S3Settings
{
    public const string SectionName = "AWS";

    [Required]
    public string Region { get; init; } = string.Empty;

    [Required]
    public string BucketName { get; init; } = string.Empty;

    [Required]
    public string CdnBaseUrl { get; init; } = string.Empty;
}
