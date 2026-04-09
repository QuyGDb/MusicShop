using MusicShop.Domain.Common;
using MusicShop.Domain.Enums;

namespace MusicShop.Domain.Entities.System;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Customer;

    // External Login Info
    public string IdentityProvider { get; set; } = "Local";
    public string? ExternalId { get; set; }
}
