using FluentAssertions;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Application.UseCases.Auth.Queries.Login;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;
using NSubstitute;
using System.Linq.Expressions;

namespace MusicShop.Application.UnitTests.UseCases.Auth.Queries.Login;

public class LoginQueryHandlerTests
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly LoginQueryHandler _handler;

    public LoginQueryHandlerTests()
    {
        _userRepository = Substitute.For<IRepository<User>>();
        _refreshTokenRepository = Substitute.For<IRepository<RefreshToken>>();
        _passwordHasher = Substitute.For<IPasswordHasher>();
        _refreshTokenHasher = Substitute.For<IRefreshTokenHasher>();
        _tokenService = Substitute.For<ITokenService>();
        _unitOfWork = Substitute.For<IUnitOfWork>();

        _handler = new LoginQueryHandler(
            _userRepository,
            _refreshTokenRepository,
            _passwordHasher,
            _refreshTokenHasher,
            _tokenService,
            _unitOfWork);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenUserDoesNotExist()
    {
        // Arrange
        LoginQuery query = new("nonexistent@example.com", "any-password");
        _userRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<CancellationToken>())
            .Returns((User?)null);

        // Act
        Result<AuthResponse> result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.InvalidCredentials);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenUserRegisteredViaExternalProvider()
    {
        // Arrange
        LoginQuery query = new LoginQuery("external@example.com", "any-password");
        User user = new User { Email = "external@example.com", PasswordHash = null };

        _userRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(user);

        // Act
        Result<AuthResponse> result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.InvalidCredentials);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenPasswordIsIncorrect()
    {
        // Arrange
        LoginQuery query = new LoginQuery("user@example.com", "wrong-password");
        User user = new User { Email = "user@example.com", PasswordHash = "correct-hash" };

        _userRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(user);

        _passwordHasher.Verify(query.Password, user.PasswordHash).Returns(false);

        // Act
        Result<AuthResponse> result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.InvalidCredentials);
    }

    [Fact]
    public async Task Handle_ShouldReturnSuccess_WhenCredentialsAreValid()
    {
        // Arrange
        LoginQuery query = new LoginQuery("user@example.com", "correct-password");
        User user = new User { Email = "user@example.com", PasswordHash = "correct-hash" };
        string accessToken = "access-token";
        string refreshToken = "refresh-token";
        DateTime accessTokenExpiry = DateTime.UtcNow.AddHours(1);
        DateTime refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        _userRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(user);

        _passwordHasher.Verify(query.Password, user.PasswordHash).Returns(true);

        _tokenService.GenerateAccessToken(user).Returns((accessToken, accessTokenExpiry));
        _tokenService.GenerateRefreshToken().Returns((refreshToken, refreshTokenExpiry));
        _refreshTokenHasher.Hash(refreshToken).Returns("refresh-token-hash");

        // Act
        Result<AuthResponse> result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.AccessToken.Should().Be(accessToken);
        result.Value.RefreshToken.Should().Be(refreshToken);

        _refreshTokenRepository.Received(1).Add(Arg.Any<RefreshToken>());
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
