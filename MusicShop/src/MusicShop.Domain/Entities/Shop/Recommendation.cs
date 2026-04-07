using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Shop;

public class Recommendation : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProductVariantId { get; set; }
    public ProductVariant ProductVariant { get; set; } = null!;

    public float Score { get; set; } // relevance score
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(24);
}
