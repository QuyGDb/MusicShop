using MusicShop.Domain.Common;

namespace MusicShop.Domain.Entities.Customer;

public class AIMessage : BaseEntity
{
    public Guid ConversationId { get; set; }
    public AIConversation Conversation { get; set; } = null!;

    public string Role { get; set; } = "user"; // user, assistant
    public string Content { get; set; } = string.Empty;
}
