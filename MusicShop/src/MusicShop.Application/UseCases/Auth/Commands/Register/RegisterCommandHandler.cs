using MediatR;
using MusicShop.Application.DTOs.Auth;
using MusicShop.Domain.Entities.System;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.UseCases.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IRepository<User> _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    // Inject required dependencies
    public RegisterCommandHandler(
        IRepository<User> userRepository, 
        IPasswordHasher passwordHasher, 
        ITokenService tokenService, 
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    // Handle the registration logic
    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if the email is already registered
        var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (existingUser != null)
        {
            throw new Exception("Error: This email is already registered!");
        }

        // Hash the password for security
        var hashedPassword = _passwordHasher.Hash(request.Password);

        // Create new User entity
        var newUser = new User
        {
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = hashedPassword,
            Role = MusicShop.Domain.Enums.UserRole.Customer
        };

        // Save to Database
        _userRepository.Add(newUser);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Generate a JWT Token
        string token = _tokenService.GenerateToken(newUser);

        // Return the AuthResponse containing user info and token
        return new AuthResponse
        {
            Token = token,
            UserId = newUser.Id,
            Email = newUser.Email,
            FullName = newUser.FullName,
            Role = newUser.Role.ToString()
        };
    }
}
