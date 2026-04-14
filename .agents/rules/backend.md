---
trigger: always_on
---

# ASP.NET Core — Coding Rules

## Stack
- .NET 10+, C# 12, Nullable enable, ImplicitUsings enable
- Clean Architecture: `Domain → Application → Infrastructure → Api`
- Minimal APIs preferred; Controllers when necessary

## Project Structure
```
Domain/        # Entities, Value Objects, Generic Interfaces (zero NuGet deps)
Application/   # Use Cases, Specialized Interfaces, CQRS Handlers, DTOs, Validators
Infrastructure/# EF Core, external services, caching
Api/           # Endpoints, Middleware, DI wiring
```

## API
- Standard REST: POST → 201 + Location, DELETE → 204, Errors → 404/400
- Versioning via URL: `/api/v1/`
- Use `TypedResults` with Minimal APIs
- No business logic in Controllers

## CQRS
- Each use case = 1 handler (`IRequest<Result<T>>`)
- Use `ValidationBehavior` pipeline for pre-handler validation

## Result Pattern
```csharp
// Do not throw exceptions for business logic errors
Result<T>.Match(onSuccess, onFailure)

public static class ProductErrors
{
    public static readonly Error NotFound = new("Product.NotFound", "Not found.");
}
```

## Validation
- FluentValidation, registered via `AddValidatorsFromAssembly`
- Validate at the Application layer, not in the Controller

## EF Core
- Each entity has its own `IEntityTypeConfiguration<T>`
- Read-only queries: `AsNoTracking()`
- Always pass `CancellationToken`
- `SaveChangesAsync` in the handler, not in the repository

## DI (Dependency Injection)
- `Scoped`: DbContext, Repository, UnitOfWork
- `Transient`: Small stateless services
- `Singleton`: Cache, HttpClientFactory
- Use primary constructors for injection

## Error Handling
- Global handler with `UseExceptionHandler` → returns `ProblemDetails` (RFC 7807)
- Do not expose stack traces to the client

## Configuration
- Strongly typed options: `IOptions<T>` + `ValidateOnStart()`
- Do not inject `IConfiguration` into the Application/Domain layers
- Do not commit secrets to source control

## Logging
```csharp
// ✅ Structured logging
logger.LogInformation("Order {OrderId} placed", order.Id);
// ❌ String interpolation
logger.LogInformation($"Order {order.Id} placed");
```

## Security
- HTTPS + HSTS enabled in production
- Rate limiting on authentication endpoints
- Parameterized queries / EF Core — no raw SQL with user input
- JWT: Short expiry + refresh tokens

## Testing
- Unit: xUnit + NSubstitute + FluentAssertions
- Integration: `WebApplicationFactory<Program>`

## Conventions
- `sealed` for concrete classes by default
- Async method suffix `Async`
- Private fields: `_camelCase`
- File-scoped namespaces
- 1 class per file, maximum ~200 LOC
- **Explicit Typing**: Always use explicit types; never use `var`.
- **Descriptive Naming**: No abbreviated variable names or lambda parameters (e.g., use `artist`, `order` instead of `x`, `o`).
- **Collections**: Prefer `IReadOnlyList<T>` for lists returned from Handlers/Repositories.

## Prohibited (Don'ts)
- `async void`, `.Result`, `.Wait()`
- Direct `HttpClient` usage → use `IHttpClientFactory`
- `dynamic`, catching `Exception` without logging/rethrowing
- Mixing sync/async code
- Using `var` for any variable declarations
- Abbreviating variable names (e.g., `x`, `o`, `i`, `dto`)