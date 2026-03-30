using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Auth.Queries.Login;

public class LoginQueryHandler : IRequestHandler<LoginQuery, AuthResponse>
{
    private readonly IRepository<User> _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    // Inject required dependencies
    public LoginQueryHandler(
        IRepository<User> userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    // Handle the login logic
    public async Task<AuthResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        // Check if the user exists
        User? existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (existingUser == null)
        {
            throw new Exception("Error: Invalid email or password!");
        }

        // Verify the provided password
        bool isPasswordValid = _passwordHasher.Verify(request.Password, existingUser.PasswordHash);
        
        if (!isPasswordValid)
        {
            throw new Exception("Error: Invalid email or password!");
        }

        // Generate JWT token
        string token = _tokenService.GenerateToken(existingUser);

        // Return authentication response
        return new AuthResponse
        {
            Token = token,
            UserId = existingUser.Id,
            Email = existingUser.Email,
            FullName = existingUser.FullName,
            Role = existingUser.Role.ToString()
        };
    }
}
