using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MusicShop.Domain.Interfaces;
using MusicShop.Infrastructure.Persistence;
using MusicShop.Infrastructure.Persistence.Repositories;
using MusicShop.Infrastructure.Security;
using MusicShop.Infrastructure.Services;
using MusicShop.Infrastructure.Cache;
using MusicShop.Application.Common.Interfaces;

namespace MusicShop.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Configure DbContext with PostgreSQL
        string? connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // 2. Register Repository & UnitOfWork
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IReleaseRepository, ReleaseRepository>();
        services.AddScoped<IArtistRepository, ArtistRepository>();
        services.AddScoped<IReleaseVersionRepository, ReleaseVersionRepository>();
        services.AddScoped<IGenreRepository, GenreRepository>();

        // 3. Register Security Services
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<IRefreshTokenHasher, RefreshTokenHasher>();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IGoogleAuthService, GoogleAuthService>();

        // 4. Register JWT Services
        // ValidateOnStart: crash immediately at startup if config is missing/invalid
        services.AddOptions<JwtSettings>()
            .Bind(configuration.GetSection(JwtSettings.SectionName))
            .ValidateOnStart();

        services.AddOptions<GoogleSettings>()
            .Bind(configuration.GetSection(GoogleSettings.SectionName))
            .ValidateOnStart();

        services.AddScoped<ITokenService, JwtTokenService>();
        
        // 5. Register Redis & Caching
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            options.InstanceName = "MusicShop_";
        });
        services.AddSingleton<ICacheService, CacheService>();

        return services;
    }
}
