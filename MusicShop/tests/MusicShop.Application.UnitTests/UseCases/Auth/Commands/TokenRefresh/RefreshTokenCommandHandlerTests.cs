using FluentAssertions;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Application.UseCases.Auth.Commands.TokenRefresh;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;
using NSubstitute;
using System.Linq.Expressions;

namespace MusicShop.Application.UnitTests.UseCases.Auth.Commands.TokenRefresh;

public class RefreshTokenCommandHandlerTests
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly RefreshTokenCommandHandler _handler;

    public RefreshTokenCommandHandlerTests()
    {
        _userRepository = Substitute.For<IRepository<User>>();
        _refreshTokenRepository = Substitute.For<IRepository<RefreshToken>>();
        _refreshTokenHasher = Substitute.For<IRefreshTokenHasher>();
        _tokenService = Substitute.For<ITokenService>();
        _unitOfWork = Substitute.For<IUnitOfWork>();

        _handler = new RefreshTokenCommandHandler(
            _userRepository,
            _refreshTokenRepository,
            _refreshTokenHasher,
            _tokenService,
            _unitOfWork);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenTokenIsMissing()
    {
        // Arrange
        RefreshTokenCommand command = new RefreshTokenCommand("");

        // Act
        Result<AuthResponse> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.InvalidRefreshToken);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenTokenNotFoundInDb()
    {
        // Arrange
        RefreshTokenCommand command = new RefreshTokenCommand("valid-token-string");
        _refreshTokenHasher.Hash(command.RefreshToken).Returns("hash");
        _refreshTokenRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<MusicShop.Domain.Entities.System.RefreshToken, bool>>>(), Arg.Any<CancellationToken>())
            .Returns((MusicShop.Domain.Entities.System.RefreshToken?)null);

        // Act
        Result<AuthResponse> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.InvalidRefreshToken);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenTokenIsRevoked()
    {
        // Arrange
        RefreshTokenCommand command = new RefreshTokenCommand("valid-token-string");
        var refreshToken = new MusicShop.Domain.Entities.System.RefreshToken 
        { 
            TokenHash = "hash", 
            RevokedAt = DateTime.UtcNow 
        };
        
        _refreshTokenHasher.Hash(command.RefreshToken).Returns("hash");
        _refreshTokenRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<MusicShop.Domain.Entities.System.RefreshToken, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(refreshToken);

        // Act
        Result<AuthResponse> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.InvalidRefreshToken);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenTokenIsExpired()
    {
        // Arrange
        RefreshTokenCommand command = new RefreshTokenCommand("valid-token-string");
        var refreshToken = new MusicShop.Domain.Entities.System.RefreshToken 
        { 
            TokenHash = "hash", 
            ExpiresAt = DateTime.UtcNow.AddDays(-1) 
        };
        
        _refreshTokenHasher.Hash(command.RefreshToken).Returns("hash");
        _refreshTokenRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<MusicShop.Domain.Entities.System.RefreshToken, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(refreshToken);

        // Act
        Result<AuthResponse> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.InvalidRefreshToken);
    }

    [Fact]
    public async Task Handle_ShouldReturnSuccess_WhenTokenIsValid_ShouldRotateToken()
    {
        // Arrange
        RefreshTokenCommand command = new RefreshTokenCommand("valid-token-string");
        var userId = Guid.NewGuid();
        var refreshToken = new MusicShop.Domain.Entities.System.RefreshToken 
        { 
            UserId = userId,
            TokenHash = "hash", 
            ExpiresAt = DateTime.UtcNow.AddDays(7) 
        };
        
        User user = new User { Id = userId, Email = "test@example.com" };
        
        _refreshTokenHasher.Hash(command.RefreshToken).Returns("hash");
        _refreshTokenRepository.FirstOrDefaultAsync(Arg.Any<Expression<Func<MusicShop.Domain.Entities.System.RefreshToken, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(refreshToken);
        
        _userRepository.GetByIdAsync(userId, Arg.Any<CancellationToken>())
            .Returns(user);
            
        _tokenService.GenerateAccessToken(user).Returns(("new-access", DateTime.UtcNow.AddHours(1)));
        _tokenService.GenerateRefreshToken().Returns(("new-refresh", DateTime.UtcNow.AddDays(7)));
        _refreshTokenHasher.Hash("new-refresh").Returns("new-hash");

        // Act
        Result<AuthResponse> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.AccessToken.Should().Be("new-access");
        result.Value.RefreshToken.Should().Be("new-refresh");
        
        refreshToken.RevokedAt.Should().NotBeNull();
        _refreshTokenRepository.Received(1).Update(refreshToken);
        _refreshTokenRepository.Received(1).Add(Arg.Is<MusicShop.Domain.Entities.System.RefreshToken>(rt => rt.TokenHash == "new-hash"));
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
