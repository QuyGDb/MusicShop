using MusicShop.Infrastructure;
using MusicShop.Application;
using Serilog;
using MusicShop.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MusicShop.API.Middleware;
using MusicShop.Infrastructure.Persistence;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// 1. Setup Logging (Serilog)
builder.Host.UseSerilog((context, logger) =>
    logger.WriteTo.Console()
          .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
          .ReadFrom.Configuration(context.Configuration));

// 2. Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "MusicShop API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = @"Please enter token in the following format: Bearer {token}",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Register selective Swagger lock filter
    c.OperationFilter<MusicShop.API.Infrastructure.AuthorizeCheckOperationFilter>();
});

// 3. Register Clean Architecture Layers
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// 4. Configure JWT Authentication
JwtSettings jwtSettings = new();
builder.Configuration.GetSection(JwtSettings.SectionName).Bind(jwtSettings);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
        NameClaimType = "name",
        RoleClaimType = "role"
    };
});

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();

// Enable CORS
app.UseCors("FrontendPolicy");

// HTTP Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    await next();
});

// Use Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 5. Initialize Database & Seed data
using (IServiceScope scope = app.Services.CreateScope())
{
    IServiceProvider services = scope.ServiceProvider;
    try
    {
        AppDbContext context = services.GetRequiredService<AppDbContext>();
        ILogger<Program> logger = services.GetRequiredService<ILogger<Program>>();

        logger.LogInformation("Checking database for seeding...");
        await DbInitializer.SeedAsync(context);
        logger.LogInformation("Database initialization complete.");
    }
    catch (Exception ex)
    {
        ILogger<Program> logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database initialization/seeding.");
    }
}

app.Run();

public partial class Program { }
