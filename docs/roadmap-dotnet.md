# Backend Development Roadmap — Vinyl Shop (.NET)

## Tech Stack tổng quan

### Backend

| Layer | Technology | Lý do chọn |
|---|---|---|
| Runtime | **.NET 10 LTS** | Modern, performance vượt trội, cross-platform |
| Framework | **ASP.NET Core 10 Web API** | Modern standard, mature ecosystem |
| Language | **C# 12** | Type safety, modern features, nullable reference types |
| ORM | **Entity Framework Core 10** | Code-first migrations, LINQ, change tracking |
| Database | **PostgreSQL 16** | JSONB, enum, full-text search, free |
| DB Driver | **Npgsql** | PostgreSQL provider cho EF Core |
| Cache | **Redis 7** + **StackExchange.Redis** | Session, cache, distributed lock |
| Queue | **Hangfire** (PostgreSQL-backed) | Background jobs, cron, retry, dashboard UI |
| Auth | **JWT Bearer** + **Google Auth** + **Identity (tùy chọn)** | Auth đa phương thức (Local + Google) |
| Validation | **FluentValidation** | Validation tách biệt khỏi controller |
| Mapping | **Manual Mapping** | Transparency, performance, no magic |
| Storage | **AWS S3 / Cloudflare R2** (AWSSDK.S3) | File upload |
| Email | **MailKit** + **SMTP / SendGrid** | Transactional email |
| Payment | **Stripe (Official SDK)** | Payment Link/Checkout Session, Global support |
| Search | **PostgreSQL FTS → Elasticsearch / Meilisearch** | Tìm kiếm sản phẩm |
| Realtime | **Server-Sent Events (SSE)** | AI streaming response |
| API Docs | **Swashbuckle (Swagger)** | Auto-generate OpenAPI từ controller |
| Logging | **Serilog** + **Seq / Elasticsearch** | Structured logging |
| Error tracking | **Sentry .NET SDK** | Exception monitoring |
| Container | **Docker + Docker Compose** | Dev environment nhất quán |
| CI/CD | **GitHub Actions** | Build, test, publish Docker image |
| Testing | **xUnit + Moq + FluentAssertions + Testcontainers** | Unit + Integration test |
| AI | **Anthropic .NET SDK / HttpClient** | Claude API integration |
| Architecture | **Clean Architecture** | Layered, testable, scalable |



---

## Kiến trúc tổng quan

```
                   ASP.NET Core 8 Web API
                   (localhost:5000 / api.vinylshop.vn)
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          PostgreSQL      Redis       Hangfire
```

### Backend — Clean Architecture

```
src/
├── VinylShop.Domain/          ← Entities, Enums, Domain Exceptions
│   ├── Entities/
│   ├── Enums/
│   └── Exceptions/
│
├── VinylShop.Application/     ← Use Cases, DTOs, Interfaces, Validators
│   ├── Features/
│   │   ├── Auth/
│   │   ├── Products/
│   │   ├── Orders/
│   │   └── ...
│   ├── Common/
│   │   ├── Interfaces/        ← IRepository, IEmailService, ICacheService
│   │   └── Behaviours/        ← MediatR pipeline behaviours
│   └── DependencyInjection.cs
│
├── MusicShop.Infrastructure/  ← EF Core, Redis, S3, Email, Stripe
│   ├── Persistence/
│   │   ├── AppDbContext.cs
│   │   ├── Migrations/
│   │   └── Repositories/
│   ├── Cache/
│   ├── Storage/
│   ├── Email/
│   ├── Payments/
│   └── DependencyInjection.cs
│
└── VinylShop.Api/             ← Controllers, Middleware, Program.cs
    ├── Controllers/
    ├── Middleware/
    ├── Filters/
    └── Program.cs
```



**Pattern chính:** **CQRS với MediatR** — mỗi use case là 1 `Command` hoặc `Query` riêng biệt.

```
Request → Controller → MediatR → Handler → Repository → DB
                               ↘ Validator (FluentValidation pipeline)
```

---

## Xếp hạng tính năng

### 🔴 Tier 1 — Bắt buộc (không có = app không chạy được)

| # | Tính năng | Phase gốc |
|---|---|---|
| 1 | Project setup + Clean Architecture + Docker Compose | ✅ |
| 2 | EF Core migrations (schema cốt lõi) | ✅ |
| 3 | Auth — Register / Login / JWT / Refresh Token | ✅ |
| 4 | Products — list, filter, detail, Redis cache | ✅ |
| 5 | Cart + Orders — tạo đơn, pessimistic lock tồn kho | ✅ |
| 6 | Stripe — Checkout Session + Webhook notification | Phase 4 |
| 7 | Hangfire — gửi email xác nhận đơn | Phase 5 |


### 🟡 Tier 2 — Quan trọng, làm sau khi Tier 1 xong

| # | Tính năng | Phase gốc |
|---|---|---|
| 9 | Order state machine đầy đủ | Phase 3 |
| 10 | Admin — CRUD products, quản lý orders | Phase 3 |
| 11 | Meilisearch — full-text search sản phẩm | Phase 2 |
| 12 | S3 upload ảnh sản phẩm | Phase 2 |
| 13 | Distributed lock (Lua script) cho Hangfire | Phase 5 |
| 14 | Testcontainers — integration tests | Phase 1 |


### 🟢 Tier 3 — Nice-to-have, làm nếu còn thời gian

| # | Tính năng | Phase gốc |
|---|---|---|
| 16 | AI Chat — Claude SSE streaming | Phase 7 |
| 17 | AI Recommendation (content-based filtering) | Phase 7 |
| 19 | Sentry error tracking | Phase 1 |
| 20 | Curated collections | Phase 2 |


---

## Timeline 4 tuần

```
Tuần 1    Foundation + Auth + Products                    (DONE)
Tuần 2    Orders + Billing (Stripe)                       (IN PROGRESS)
Tuần 3    Admin UI + Testing                              (PENDING)
Tuần 4    AI Features + Cleanup                           (PENDING)
```

---

## Phase 1 — Foundation

> **Mục tiêu:** Solution chạy được, có auth, có catalog cơ bản.
> **Tech nổi bật:** ASP.NET Core, EF Core, PostgreSQL, JWT, MediatR, Clean Architecture

### 1.1 Project Setup

- [ ] Tạo solution với cấu trúc Clean Architecture:
  ```
  dotnet new sln -n VinylShop
  dotnet new classlib -n VinylShop.Domain
  dotnet new classlib -n VinylShop.Application
  dotnet new classlib -n VinylShop.Infrastructure
  dotnet new webapi   -n VinylShop.Api
  ```
- [ ] Cài packages cốt lõi:
  ```xml
  <!-- Application -->
  <PackageReference Include="MediatR" />
  <PackageReference Include="FluentValidation.DependencyInjectionExtensions" />
  <!-- No AutoMapper: Using Manual Mapping -->

  <!-- Infrastructure -->
  <PackageReference Include="Microsoft.EntityFrameworkCore" />
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" />
  <PackageReference Include="StackExchange.Redis" />
  <PackageReference Include="Hangfire.AspNetCore" />
  <PackageReference Include="Hangfire.PostgreSql" />
  <PackageReference Include="Serilog.AspNetCore" />

  <!-- Api -->
  <PackageReference Include="Swashbuckle.AspNetCore" />
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" />
  <PackageReference Include="Google.Apis.Auth" />
  ```
- [ ] Cấu hình **Serilog** — structured logging ra console + file
- [ ] Setup **Docker Compose**: `api` + `postgres` + `redis`
- [ ] Cấu hình **Swagger** với JWT Bearer support
- [ ] Setup **MediatR pipeline behaviours**: Validation → Logging → Exception handling

**MediatR Validation Behaviour:**
```csharp
public class ValidationBehaviour<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public async Task<TResponse> Handle(TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var failures = _validators
            .Select(v => v.Validate(context))
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Count != 0)
            throw new ValidationException(failures);

        return await next();
    }
}
```

---

### 1.2 EF Core — DbContext & Migration 1

**AppDbContext.cs** với cấu hình PostgreSQL enum:
```csharp
public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Artist> Artists => Set<Artist>();
    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<Release> Releases => Set<Release>();
    public DbSet<ReleaseVersion> ReleaseVersions => Set<ReleaseVersion>();
    public DbSet<Label> Labels => Set<Label>();
    public DbSet<Track> Tracks => Set<Track>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // PostgreSQL enum
        builder.HasPostgresEnum<Role>();
        builder.HasPostgresEnum<Format>();
    }
}
```

**Entity Configuration (Fluent API):**
```csharp
public class ArtistConfiguration : IEntityTypeConfiguration<Artist>
{
    public void Configure(EntityTypeBuilder<Artist> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Name).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Country).HasMaxLength(100);

        // Many-to-many với Genres
        builder.HasMany(a => a.Genres)
               .WithMany(g => g.Artists)
               .UsingEntity<ArtistGenre>(
                   j => j.HasKey(ag => new { ag.ArtistId, ag.GenreId })
               );
    }
}
```

Tạo migration:
```bash
dotnet ef migrations add InitialCatalog --project VinylShop.Infrastructure --startup-project VinylShop.Api
dotnet ef database update
```

---

### 1.3 Auth Module

**Endpoints:** `POST /auth/register`, `POST /auth/login`, `POST /auth/google-login`, `POST /auth/logout`, `GET /auth/me`, `PATCH /auth/me`

**Google Auth Flow:**
1. Frontend gửi `idToken` nhận từ Google SSO.
2. Backend dùng `GoogleJsonWebSignature.ValidateAsync` để xác thực token.
3. Kiểm tra email trong DB:
   - Nếu tồn tại: Cập nhật `ProviderId` (nếu cần) và đăng nhập.
   - Nếu chưa: Tạo User mới với `AuthProvider = Google`.
4. Issue JWT và Refresh Token như login bình thường.

**Xử lý Google Token:**
```csharp
public async Task<AuthResponse> HandleGoogleLogin(string idToken)
{
    var settings = new GoogleJsonWebSignature.ValidationSettings
    {
        Audience = new[] { _config["Google:ClientId"] }
    };

    var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
    
    var user = await _userRepo.GetByEmailAsync(payload.Email);
    if (user == null)
    {
        user = new User 
        { 
            Email = payload.Email, 
            Name = payload.Name,
            AuthProvider = AuthProvider.Google,
            ProviderId = payload.Subject 
        };
        await _userRepo.CreateAsync(user);
    }
    
    return GenerateAuthResponse(user);
}
```

**JWT + Refresh Token:**
```csharp
public class TokenService : ITokenService
{
    public string GenerateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15), // Access token: 15 phút
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }
}
```

**Refresh Token lưu Redis với TTL:**
```csharp
// Key: refresh_token:{userId}, Value: token, TTL: 7 ngày
await _redis.StringSetAsync(
    key: $"refresh_token:{user.Id}",
    value: refreshToken,
    expiry: TimeSpan.FromDays(7)
);
```

**Authorization Policy:**
```csharp
// Program.cs
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("CustomerOrAdmin", p => p.RequireRole("Customer", "Admin"));
});

// Controller
[Authorize(Policy = "AdminOnly")]
[HttpPost]
public async Task<IActionResult> CreateProduct(...) { }
```

**Password hashing với BCrypt.Net:**
```csharp
public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
public bool Verify(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
```

---

### 1.4 Catalog Module (Read-only + Admin CRUD)

**CQRS pattern — mỗi feature là 1 folder:**

```
Application/Features/Artists/
├── Queries/
│   ├── GetArtists/
│   │   ├── GetArtistsQuery.cs
│   │   ├── GetArtistsQueryHandler.cs
│   │   └── GetArtistsQueryValidator.cs
│   └── GetArtistById/
│       ├── GetArtistByIdQuery.cs
│       └── GetArtistByIdQueryHandler.cs
├── Commands/
│   ├── CreateArtist/
│   │   ├── CreateArtistCommand.cs
│   │   ├── CreateArtistCommandHandler.cs
│   │   └── CreateArtistCommandValidator.cs
│   └── UpdateArtist/
└── DTOs/
    └── ArtistDto.cs
```

**Query Handler với filtering:**
```csharp
public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery q, CancellationToken ct)
    {
        var query = _context.Products
            .Include(p => p.Variants)
            .Include(p => p.ReleaseVersion.Release.Artist)
            .Include(p => p.ReleaseVersion.Release.Genres)
            .Where(p => p.IsActive);

        if (q.Format.HasValue)
            query = query.Where(p => p.Format == q.Format);

        if (!string.IsNullOrEmpty(q.Genre))
            query = query.Where(p =>
                p.ReleaseVersion.Release.Genres.Any(g => g.Slug == q.Genre));

        if (q.MinPrice.HasValue)
            query = query.Where(p =>
                p.Variants.Any(v => v.Price >= q.MinPrice));

        if (!string.IsNullOrEmpty(q.SearchQuery))
            query = query.Where(p =>
                EF.Functions.ILike(p.Name, $"%{q.SearchQuery}%"));

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((q.Page - 1) * q.Limit)
            .Take(q.Limit)
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .ToListAsync(ct);

        return new PagedResult<ProductDto>(items, total, q.Page, q.Limit);
    }
}
```

**Global Exception Handler (Middleware):**
```csharp
public class ExceptionHandlingMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try { await next(context); }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 422;
            await context.Response.WriteAsJsonAsync(new {
                success = false,
                error = new { code = "VALIDATION_ERROR", message = ex.Message }
            });
        }
        catch (NotFoundException ex)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new {
                success = false,
                error = new { code = "NOT_FOUND", message = ex.Message }
            });
        }
        catch (BusinessException ex)
        {
            context.Response.StatusCode = 409;
            await context.Response.WriteAsJsonAsync(new {
                success = false,
                error = new { code = ex.Code, message = ex.Message }
            });
        }
    }
}
```

---

## Phase 2 — Products & Variants

> **Mục tiêu:** Catalog hoàn chỉnh, filter sản phẩm, cache.
> **Tech nổi bật:** EF Core advanced, IMemoryCache + Redis, AutoMapper projections

### 2.1 EF Core Migration 2

```
products, product_variants,
vinyl_attributes, cd_attributes, cassette_attributes,
curated_collections, curated_collection_items
```

**Table-per-Type (TPT) cho attributes:**
```csharp
// Domain
public abstract class ProductVariantAttributes { public Guid ProductVariantId { get; set; } }
public class VinylAttributes : ProductVariantAttributes
{
    public DiscColor DiscColor { get; set; }
    public int WeightGrams { get; set; }
    public int SpeedRpm { get; set; }
    public DiscCount DiscCount { get; set; }
    public SleeveType SleeveType { get; set; }
}

// Configuration
builder.Entity<VinylAttributes>().ToTable("vinyl_attributes");
builder.Entity<CdAttributes>().ToTable("cd_attributes");
builder.Entity<CassetteAttributes>().ToTable("cassette_attributes");
```

---

### 2.2 Products Module — Manual Mapping

**Sử dụng static Extension methods hoặc Select trực tiếp trong Query:**
```csharp
public static class ProductMappings
{
    public static IQueryable<ProductListDto> ProjectToDto(this IQueryable<Product> query)
    {
        return query.Select(p => new ProductListDto
        {
            Id = p.Id,
            Name = p.Name,
            Format = p.Format,
            IsLimited = p.IsLimited,
            IsPreorder = p.IsPreorder,
            CoverUrl = p.CoverUrl,
            MinPrice = p.Variants.Any() ? p.Variants.Min(v => v.Price) : 0,
            MaxPrice = p.Variants.Any() ? p.Variants.Max(v => v.Price) : 0,
            InStock = p.Variants.Any(v => v.StockQty > 0 && v.IsAvailable)
        });
    }
}
```

---

### 2.3 Redis Cache Layer

**IDistributedCache wrapper:**
```csharp
public class CacheService : ICacheService
{
    private readonly IDistributedCache _cache;

    public async Task<T?> GetAsync<T>(string key)
    {
        var data = await _cache.GetStringAsync(key);
        return data is null ? default : JsonSerializer.Deserialize<T>(data);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? ttl = null)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = ttl ?? TimeSpan.FromMinutes(5)
        };
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(value), options);
    }

    public async Task RemoveByPrefixAsync(string prefix)
    {
        var server = _connectionMultiplexer.GetServer(_connectionMultiplexer.GetEndPoints().First());
        var keys = server.Keys(pattern: $"{prefix}*").ToArray();
        if (keys.Any())
            await _connectionMultiplexer.GetDatabase().KeyDeleteAsync(keys);
    }
}
```

**Cache-aside trong Handler:**
```csharp
public async Task<List<GenreDto>> Handle(GetGenresQuery q, CancellationToken ct)
{
    const string cacheKey = "genres:all";
    var cached = await _cache.GetAsync<List<GenreDto>>(cacheKey);
    if (cached is not null) return cached;

    var genres = await _context.Genres
        .ProjectTo<GenreDto>(_mapper.ConfigurationProvider)
        .ToListAsync(ct);

    await _cache.SetAsync(cacheKey, genres, TimeSpan.FromHours(1));
    return genres;
}
```

---

### 2.4 Tích hợp Meilisearch

```csharp
// Package: Meilisearch
public class ProductSearchService : IProductSearchService
{
    private readonly MeilisearchClient _client;

    public async Task IndexProductAsync(Product product)
    {
        var index = _client.Index("products");
        await index.AddDocumentsAsync(new[]
        {
            new ProductSearchDocument
            {
                Id = product.Id,
                Name = product.Name,
                ArtistName = product.ReleaseVersion.Release.Artist.Name,
                Genres = product.ReleaseVersion.Release.Genres.Select(g => g.Name).ToList(),
                Format = product.Format.ToString(),
                Tracks = product.ReleaseVersion.Release.Tracks.Select(t => t.Title).ToList(),
            }
        });
    }

    public async Task<IEnumerable<Guid>> SearchAsync(string q)
    {
        var index = _client.Index("products");
        var result = await index.SearchAsync<ProductSearchDocument>(q, new SearchQuery
        {
            AttributesToSearchOn = new[] { "name", "artistName", "genres", "tracks" },
        });
        return result.Hits.Select(h => h.Id);
    }
}
```

---

## Phase 3 — Cart & Orders

> **Mục tiêu:** Luồng mua hàng hoàn chỉnh, xử lý tồn kho chính xác.
> **Tech nổi bật:** EF Core transactions, Pessimistic locking, Hangfire

### 3.1 EF Core Migration 3

```
carts, cart_items, orders, order_items
```

---

### 3.2 Checkout — Database Transaction

```csharp
public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderResult>
{
    public async Task<CreateOrderResult> Handle(CreateOrderCommand cmd, CancellationToken ct)
    {
        await using var transaction = await _context.Database
            .BeginTransactionAsync(IsolationLevel.RepeatableRead, ct);

        try
        {
            // 1. Load cart items
            var cartItems = await _context.CartItems
                .Include(ci => ci.ProductVariant.Product)
                .Where(ci => ci.Cart.UserId == cmd.UserId)
                .ToListAsync(ct);

            if (!cartItems.Any())
                throw new BusinessException("CART_EMPTY", "Giỏ hàng trống");

            var variantIds = cartItems.Select(ci => ci.ProductVariantId).ToList();

            // 2. Pessimistic lock — khóa variants để tránh race condition
            var variants = await _context.ProductVariants
                .FromSqlRaw(@"
                    SELECT * FROM product_variants
                    WHERE id = ANY(@ids)
                    FOR UPDATE",
                    new NpgsqlParameter("ids", variantIds.ToArray()))
                .ToListAsync(ct);

            // 3. Kiểm tra tồn kho
            foreach (var item in cartItems)
            {
                var variant = variants.First(v => v.Id == item.ProductVariantId);
                if (!variant.IsAvailable || variant.StockQty < item.Quantity)
                    throw new BusinessException("OUT_OF_STOCK",
                        $"Sản phẩm {variant.VariantName} không đủ hàng");
            }

            // 4. Tính tổng tiền
            var totalAmount = cartItems.Sum(ci =>
                variants.First(v => v.Id == ci.ProductVariantId).Price * ci.Quantity);

            // 5. Tạo order — snapshot giá và địa chỉ
            var order = new Order
            {
                UserId          = cmd.UserId,
                Status          = OrderStatus.Pending,
                ShippingAddress = cmd.ShippingAddress,
                RecipientName   = cmd.RecipientName,
                Phone           = cmd.Phone,
                TotalAmount     = totalAmount,
                Items = cartItems.Select(ci => new OrderItem
                {
                    ProductVariantId = ci.ProductVariantId,
                    Quantity         = ci.Quantity,
                    UnitPrice        = variants.First(v => v.Id == ci.ProductVariantId).Price,
                }).ToList(),
            };
            _context.Orders.Add(order);

            // 6. Trừ stock (bỏ qua nếu is_preorder)
            foreach (var item in cartItems)
            {
                var variant = variants.First(v => v.Id == item.ProductVariantId);
                if (!item.ProductVariant.Product.IsPreorder)
                    variant.StockQty -= item.Quantity;
            }

            // 7. Tạo payment record
            var payment = new Payment
            {
                OrderId = order.Id,
                Method  = cmd.PaymentMethod,
                Amount  = totalAmount,
                Status  = PaymentStatus.Pending,
            };
            _context.Payments.Add(payment);

            // 8. Xóa giỏ hàng
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            // 9. Enqueue background job gửi email (ngoài transaction)
            _backgroundJobs.Enqueue<IEmailService>(s =>
                s.SendOrderCreatedAsync(order.Id));

            return new CreateOrderResult(order, payment);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }
}
```

---

### 3.3 Order State Machine

```csharp
public static class OrderStateMachine
{
    private static readonly Dictionary<OrderStatus, OrderStatus[]> ValidTransitions = new()
    {
        [OrderStatus.Pending]   = [OrderStatus.Confirmed, OrderStatus.Cancelled],
        [OrderStatus.Confirmed] = [OrderStatus.Shipped, OrderStatus.Cancelled],
        [OrderStatus.Shipped]   = [OrderStatus.Delivered],
        [OrderStatus.Delivered] = [OrderStatus.Completed],
        [OrderStatus.Completed] = [],
        [OrderStatus.Cancelled] = [],
    };

    public static bool CanTransition(OrderStatus current, OrderStatus next)
        => ValidTransitions[current].Contains(next);
}

// Dùng trong Handler
public async Task<Unit> Handle(UpdateOrderStatusCommand cmd, CancellationToken ct)
{
    var order = await _context.Orders.FindAsync(cmd.OrderId, ct)
        ?? throw new NotFoundException("Order not found");

    if (!OrderStateMachine.CanTransition(order.Status, cmd.NewStatus))
        throw new BusinessException("INVALID_STATUS_TRANSITION",
            $"Không thể chuyển từ {order.Status} sang {cmd.NewStatus}");

    order.Status = cmd.NewStatus;
    if (cmd.NewStatus == OrderStatus.Shipped)
        order.TrackingNumber = cmd.TrackingNumber
            ?? throw new BusinessException("TRACKING_REQUIRED", "Cần mã vận chuyển");

    var jobMethod = cmd.NewStatus switch
    {
        OrderStatus.Confirmed => nameof(IEmailService.SendOrderConfirmedAsync),
        OrderStatus.Shipped   => nameof(IEmailService.SendOrderShippedAsync),
        OrderStatus.Completed => nameof(IEmailService.SendOrderCompletedAsync),
        OrderStatus.Cancelled => nameof(IEmailService.SendOrderCancelledAsync),
        _ => null
    };
    if (jobMethod is not null)
        _backgroundJobs.Enqueue<IEmailService>(s => s.GetType().GetMethod(jobMethod)!
            .Invoke(s, [order.Id]));

    await _context.SaveChangesAsync(ct);
    return Unit.Value;
}
```

---

## Phase 4 — Payment

> **Mục tiêu:** Tích hợp Stripe, xử lý callback an toàn.
> **Tech nổi bật:** HMAC-SHA512, Webhook security, Idempotency

### 4.1 Stripe Integration

```csharp
public class StripeService : IStripeService
{
    public string CreatePaymentUrl(Order order, string returnUrl)
    {
        var now = DateTime.UtcNow.AddHours(7); // Giờ VN
        var parameters = new SortedDictionary<string, string>
        {
            ["vnp_Version"]    = "2.1.0",
            ["vnp_Command"]    = "pay",
            ["vnp_TmnCode"]    = _options.TmnCode,
            ["vnp_Amount"]     = ((long)(order.TotalAmount * 100)).ToString(),
            ["vnp_TxnRef"]     = order.Id.ToString(),
            ["vnp_OrderInfo"]  = $"Thanh toan don hang {order.Id}",
            ["vnp_ReturnUrl"]  = returnUrl,
            ["vnp_IpAddr"]     = "127.0.0.1",
            ["vnp_CreateDate"] = now.ToString("yyyyMMddHHmmss"),
            ["vnp_CurrCode"]   = "VND",
            ["vnp_Locale"]     = "vn",
            ["vnp_OrderType"]  = "other",
        };

        var signData = string.Join("&",
            parameters.Select(kvp => $"{kvp.Key}={WebUtility.UrlEncode(kvp.Value)}"));

        var signature = ComputeHmacSha512(_options.HashSecret, signData);
        parameters["vnp_SecureHash"] = signature;

        return $"{_options.PaymentUrl}?{string.Join("&", parameters.Select(kvp => $"{kvp.Key}={kvp.Value}"))}";
    }

    public bool VerifySignature(IQueryCollection query)
    {
        var vnpSecureHash = query["vnp_SecureHash"].ToString();
        var parameters = query
            .Where(kvp => kvp.Key != "vnp_SecureHash" && kvp.Key.StartsWith("vnp_"))
            .OrderBy(kvp => kvp.Key)
            .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());

        var signData = string.Join("&",
            parameters.Select(kvp => $"{kvp.Key}={WebUtility.UrlEncode(kvp.Value)}"));

        var expectedHash = ComputeHmacSha512(_options.HashSecret, signData);
        return expectedHash.Equals(vnpSecureHash, StringComparison.OrdinalIgnoreCase);
    }

    private static string ComputeHmacSha512(string key, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash).ToLower();
    }
}
```

**IPN Handler — Idempotent:**
```csharp
[HttpPost("Stripe/ipn")]
public async Task<IActionResult> StripeIpn([FromQuery] StripeIpnQuery query)
{
    if (!_StripeService.VerifySignature(Request.Query))
        return Ok(new { RspCode = "97", Message = "Invalid signature" });

    var payment = await _paymentRepo.FindByOrderIdAsync(Guid.Parse(query.VnpTxnRef));
    if (payment is null)
        return Ok(new { RspCode = "01", Message = "Order not found" });

    // Idempotency — đã xử lý rồi thì trả về success luôn
    if (payment.Status != PaymentStatus.Pending)
        return Ok(new { RspCode = "02", Message = "Already processed" });

    var isSuccess = query.VnpResponseCode == "00";
    payment.Status = isSuccess ? PaymentStatus.Success : PaymentStatus.Failed;
    payment.TransactionCode = query.VnpTransactionNo;
    payment.PaidAt = isSuccess ? DateTime.UtcNow : null;
    await _unitOfWork.SaveChangesAsync();

    return Ok(new { RspCode = "00", Message = "Confirm Success" });
}
```

---

## Phase 5 — Wantlist, Collection & Notifications

> **Mục tiêu:** Email notification, background jobs, wantlist restock alert.
> **Tech nổi bật:** Hangfire, MailKit, Distributed Lock, Cron

### 5.1 Hangfire Setup

```csharp
// Program.cs
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(connectionString));

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = 5;
    options.Queues = ["critical", "default", "low"];
});

// Dashboard
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = [new HangfireAdminAuthorizationFilter()]
});
```

---

### 5.2 Email Service với MailKit

```csharp
public class EmailService : IEmailService
{
    public async Task SendOrderCreatedAsync(Guid orderId)
    {
        var order = await _orderRepo.GetWithDetailsAsync(orderId);
        var template = await _templateEngine.RenderAsync("order-created", new { Order = order });

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Vinyl Shop", "no-reply@vinylshop.vn"));
        message.To.Add(new MailboxAddress(order.User.Name, order.User.Email));
        message.Subject = $"Đơn hàng #{orderId} đã được tạo";
        message.Body = new TextPart(TextFormat.Html) { Text = template };

        using var client = new SmtpClient();
        await client.ConnectAsync(_options.Host, _options.Port, _options.UseSsl);
        await client.AuthenticateAsync(_options.Username, _options.Password);
        await client.SendAsync(message);

        await _notificationLogRepo.CreateAsync(new NotificationLog
        {
            UserId      = order.UserId,
            Type        = NotificationType.OrderCreated,
            ReferenceId = orderId,
            Status      = NotificationStatus.Sent,
            SentAt      = DateTime.UtcNow,
        });
    }
}
```

---

### 5.3 Restock Notification — Distributed Lock

```csharp
public async Task NotifyWantlistUsersAsync(Guid productId)
{
    var lockKey   = $"restock_lock:{productId}";
    var lockValue = Guid.NewGuid().ToString();

    bool acquired = await _redis.StringSetAsync(
        lockKey, lockValue,
        expiry: TimeSpan.FromMinutes(5),
        when: When.NotExists);

    if (!acquired) return;

    try
    {
        var sevenDaysAgo   = DateTime.UtcNow.AddDays(-7);
        var eligibleItems  = await _wantlistRepo.FindEligibleForNotificationAsync(
            productId, sevenDaysAgo);

        foreach (var item in eligibleItems)
        {
            BackgroundJob.Enqueue<IEmailService>(s =>
                s.SendRestockNotificationAsync(item.UserId, productId));

            item.LastNotifiedAt = DateTime.UtcNow;
        }

        await _unitOfWork.SaveChangesAsync();
    }
    finally
    {
        // Chỉ release lock nếu vẫn là mình đang giữ
        var script = LuaScript.Prepare(@"
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else return 0 end");
        await _redis.ScriptEvaluateAsync(script,
            new { KEYS = new RedisKey[] { lockKey }, ARGV = new RedisValue[] { lockValue } });
    }
}
```

---

### 5.4 Hangfire Recurring Jobs

```csharp
RecurringJob.AddOrUpdate<IConversationCleanupService>(
    "cleanup-expired-conversations",
    s => s.CleanupExpiredAsync(),
    Cron.Minutely(5));

RecurringJob.AddOrUpdate<IRecommendationService>(
    "refresh-recommendations",
    s => s.RefreshAllAsync(),
    "0 2 * * *"); // Mỗi đêm 2am
```

---

## Tổng hợp Roadmap

```
Tuần 1 — Foundation + Auth + Products
  Clean Architecture, EF Core, JWT, Redis cache, Catalog

Tuần 2 — Orders + Payment + Email
  Checkout transaction, Pessimistic lock, Stripe, Hangfire

Tuần 3 — Stabilization
  Unit tests, Integration tests, Fix bugs

Tuần 4 — Tier 2 Backend mở rộng
  State machine, Admin CRUD, 
  Meilisearch, S3 upload, Distributed lock, Testcontainers
  [Tier 3 nếu còn giờ: AI Chat]
```

---

## Tech Stack — Mapping theo Phase

| Phase | Technologies học được |
|---|---|
| 1 | C# 12, ASP.NET Core 8, EF Core 8, PostgreSQL, Npgsql, JWT, MediatR, FluentValidation, AutoMapper, Serilog, Docker |
| 2 | EF Core advanced (TPT, projections), IDistributedCache, StackExchange.Redis, Meilisearch, AWSSDK.S3 |
| 3 | EF Core transactions, Pessimistic locking, State machine pattern, Hangfire enqueue |
| 4 | HMAC-SHA512, Webhook security, Idempotency, IOptions pattern |
| 5 | Hangfire (recurring, queues, dashboard), MailKit, Distributed lock (Lua script), Cron |
| 8 | (Dành cho Frontend Team / Repo riêng) |

---

## Checklist CV / Portfolio

Hoàn thành project này, CV có thể highlight:

**Backend .NET:**
- **ASP.NET Core 8 Web API** — Clean Architecture, CQRS với MediatR
- **Entity Framework Core 8** — Code-first migrations, transactions, pessimistic locking, TPT
- **Dapper** — Raw SQL cho complex queries, dùng song song với EF Core
- **PostgreSQL** — Npgsql, enum types, full-text search, aggregate queries
- **Redis** — IDistributedCache, StackExchange.Redis, distributed lock với Lua script
- **Hangfire** — Background jobs, recurring cron, retry, dashboard
- **Authentication** — JWT Bearer, refresh token, role-based authorization policy
- **FluentValidation** — MediatR pipeline behaviour, complex validation rules
- **AutoMapper** — Projections, computed fields
- **Payment Integration** — Stripe, HMAC-SHA512, IPN idempotency
- **Search** — Meilisearch .NET SDK
- **File Storage** — AWSSDK.S3 multipart upload
- **AI Integration** — Anthropic API qua HttpClient, SSE streaming với IAsyncEnumerable *(nếu làm)*
- **Testing** — xUnit, Moq, FluentAssertions, Testcontainers (PostgreSQL + Redis in Docker)
- **Docker** — Multi-stage Dockerfile, docker-compose với health checks
- **Design Patterns** — Repository, Unit of Work, State Machine, Idempotency, Cache-aside




