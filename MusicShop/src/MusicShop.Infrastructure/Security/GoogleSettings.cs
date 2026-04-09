using System.ComponentModel.DataAnnotations;

namespace MusicShop.Infrastructure.Security;

public sealed class GoogleSettings
{
    public const string SectionName = "GoogleSettings";

    [Required]
    public string ClientId { get; set; } = string.Empty;
}
