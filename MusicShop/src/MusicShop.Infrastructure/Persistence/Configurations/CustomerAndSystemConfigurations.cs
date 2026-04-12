using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MusicShop.Domain.Entities.Customer;
using MusicShop.Domain.Entities.System;

namespace MusicShop.Infrastructure.Persistence.Configurations;

public class WantlistItemConfiguration : IEntityTypeConfiguration<WantlistItem>
{
    public void Configure(EntityTypeBuilder<WantlistItem> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.HasIndex(x => new { x.UserId, x.ProductId }).IsUnique();
    }
}

public class UserCollectionConfiguration : IEntityTypeConfiguration<UserCollection>
{
    public void Configure(EntityTypeBuilder<UserCollection> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.HasIndex(x => new { x.UserId, x.ProductId }).IsUnique();
    }
}



public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.Property(x => x.FullName).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Role).HasConversion<string>();
    }
}

public class AIConversationConfiguration : IEntityTypeConfiguration<AIConversation>
{
    public void Configure(EntityTypeBuilder<AIConversation> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.HasMany(x => x.Messages)
            .WithOne(x => x.Conversation)
            .HasForeignKey(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class AIMessageConfiguration : IEntityTypeConfiguration<AIMessage>
{
    public void Configure(EntityTypeBuilder<AIMessage> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Role).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Content).IsRequired();
    }
}

public class NotificationLogConfiguration : IEntityTypeConfiguration<NotificationLog>
{
    public void Configure(EntityTypeBuilder<NotificationLog> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Type).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Status).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Channel).IsRequired().HasMaxLength(50);
    }
}

public class AdminActivityLogConfiguration : IEntityTypeConfiguration<AdminActivityLog>
{
    public void Configure(EntityTypeBuilder<AdminActivityLog> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Action).IsRequired().HasMaxLength(100);
        builder.Property(x => x.EntityType).IsRequired().HasMaxLength(100);
    }
}
