using System.Linq.Expressions;
using FluentAssertions;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Application.UseCases.Auth.Commands.Register;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Errors;
using MusicShop.Domain.Interfaces;
using NSubstitute;

namespace MusicShop.Application.UnitTests.UseCases.Auth.Commands.Register;

public class RegisterCommandHandlerTests
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly RegisterCommandHandler _handler;

    public RegisterCommandHandlerTests()
    {
        _userRepository = Substitute.For<IRepository<User>>();
        _refreshTokenRepository = Substitute.For<IRepository<RefreshToken>>();
        _passwordHasher = Substitute.For<IPasswordHasher>();
        _refreshTokenHasher = Substitute.For<IRefreshTokenHasher>();
        _tokenService = Substitute.For<ITokenService>();
        _unitOfWork = Substitute.For<IUnitOfWork>();

        _handler = new RegisterCommandHandler(
            _userRepository,
            _refreshTokenRepository,
            _passwordHasher,
            _refreshTokenHasher,
            _tokenService,
            _unitOfWork);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenEmailAlreadyExists()
    {
        // Arrange
        RegisterCommand command = new RegisterCommand("existing@example.com", "Password123", "Full Name");

        _userRepository.FirstOrDefaultAsync(
            Arg.Any<Expression<Func<User, bool>>>(),
            Arg.Any<CancellationToken>())
            .Returns(new User { Email = command.Email });

        // Act
        Result<AuthResponse> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(AuthErrors.EmailAlreadyExists);
        
        await _unitOfWork.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_ShouldReturnSuccess_WhenUserIsRegisteredSuccessfully()
    {
        // Arrange
        RegisterCommand command = new RegisterCommand("new@example.com", "Password123", "Full Name");
        string expectedPasswordHash = "hashed_password";
        string expectedRefreshTokenHash = "hashed_refresh_token";
        string accessToken = "access_token";
        string refreshToken = "refresh_token";
        DateTime accessTokenExpiry = DateTime.UtcNow.AddHours(1);
        DateTime refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        _userRepository.FirstOrDefaultAsync(
            Arg.Any<Expression<Func<User, bool>>>(),
            Arg.Any<CancellationToken>())
            .Returns((User?)null);

        _passwordHasher.Hash(command.Password).Returns(expectedPasswordHash);
        
        _tokenService.GenerateAccessToken(Arg.Any<User>())
            .Returns((accessToken, accessTokenExpiry));
            
        _tokenService.GenerateRefreshToken()
            .Returns((refreshToken, refreshTokenExpiry));

        _refreshTokenHasher.Hash(refreshToken).Returns(expectedRefreshTokenHash);

        // Act
        Result<AuthResponse> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.User.Email.Should().Be(command.Email);
        result.Value.AccessToken.Should().Be(accessToken);
        result.Value.RefreshToken.Should().Be(refreshToken);

        // Verify Repository & UnitOfWork calls
        _userRepository.Received(1).Add(Arg.Is<User>(u => 
            u.Email == command.Email && 
            u.PasswordHash == expectedPasswordHash));

        _refreshTokenRepository.Received(1).Add(Arg.Is<RefreshToken>(rt => 
            rt.TokenHash == expectedRefreshTokenHash && 
            rt.ExpiresAt == refreshTokenExpiry));

        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
