using MusicShop.Domain.Common;

namespace MusicShop.Application.Common.Interfaces;

public record GoogleUserPayload(string Email, string Name, string ExternalId);

public interface IGoogleAuthService
{
    Task<Result<GoogleUserPayload>> VerifyTokenAsync(string idToken, CancellationToken cancellationToken);
}
