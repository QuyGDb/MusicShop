using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MusicShop.Application.Common.Interfaces;
using Stripe;

namespace MusicShop.Infrastructure.Payments;

public static class StripeServiceRegistration
{
    public static IServiceCollection AddStripeServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<StripeSettings>(configuration.GetSection(StripeSettings.SectionName));

        // Set static key once at startup from configuration
        StripeSettings? stripeSettings = configuration.GetSection(StripeSettings.SectionName).Get<StripeSettings>();
        if (stripeSettings != null && !string.IsNullOrEmpty(stripeSettings.SecretKey))
        {
            StripeConfiguration.ApiKey = stripeSettings.SecretKey;
        }

        services.AddScoped<IStripeService, StripeService>();

        return services;
    }
}
