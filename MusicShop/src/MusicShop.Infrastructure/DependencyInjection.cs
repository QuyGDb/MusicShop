using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MusicShop.Domain.Interfaces;
using MusicShop.Infrastructure.Persistence;
using MusicShop.Infrastructure.Persistence.Repositories;
using MusicShop.Infrastructure.Security;
using MusicShop.Infrastructure.Services;

namespace MusicShop.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Configure DbContext with PostgreSQL
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // 2. Register Repository & UnitOfWork
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));

        // 3. Register Security Services
        services.AddSingleton<IPasswordHasher, PasswordHasher>();

        // 4. Register JWT Services
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.AddSingleton<ITokenService, JwtTokenService>();

        return services;
    }
}
