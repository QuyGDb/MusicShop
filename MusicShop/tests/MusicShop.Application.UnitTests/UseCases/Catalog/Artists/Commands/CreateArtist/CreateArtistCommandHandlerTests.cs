using FluentAssertions;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.CreateArtist;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;
using NSubstitute;

namespace MusicShop.Application.UnitTests.UseCases.Catalog.Artists.Commands.CreateArtist;

public class CreateArtistCommandHandlerTests
{
    private readonly IRepository<Artist> _artistRepository;
    private readonly IRepository<Genre> _genreRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly CreateArtistCommandHandler _handler;

    public CreateArtistCommandHandlerTests()
    {
        _artistRepository = Substitute.For<IRepository<Artist>>();
        _genreRepository = Substitute.For<IRepository<Genre>>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _handler = new CreateArtistCommandHandler(_artistRepository, _genreRepository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_Should_ReturnSuccess_When_ValidRequest()
    {
        // Arrange
        CreateArtistCommand command = new CreateArtistCommand(
            "Artist Name",
            "artist-name",
            "Bio",
            "Vietnam",
            null,
            null);

        _artistRepository.FirstOrDefaultAsync(Arg.Any<System.Linq.Expressions.Expression<System.Func<Artist, bool>>>(), Arg.Any<CancellationToken>())
            .Returns((Artist?)null);

        // Act
        Result<string> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("artist-name");
        _artistRepository.Received(1).Add(Arg.Any<Artist>());
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_When_DuplicateName()
    {
        // Arrange
        CreateArtistCommand command = new CreateArtistCommand("Artist Name", "slug", null, null, null);
        
        // Mock finding an existing artist with the same name
        _artistRepository.FirstOrDefaultAsync(Arg.Any<System.Linq.Expressions.Expression<System.Func<Artist, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(new Artist { Name = "Artist Name" });

        // Act
        Result<string> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ArtistErrors.DuplicateName);
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_When_GenreNotFound()
    {
        // Arrange
        List<Guid> genreIds = new List<Guid> { Guid.NewGuid() };
        CreateArtistCommand command = new CreateArtistCommand("Artist Name", "slug", null, null, null, genreIds);

        _artistRepository.FirstOrDefaultAsync(Arg.Any<System.Linq.Expressions.Expression<System.Func<Artist, bool>>>(), Arg.Any<CancellationToken>())
            .Returns((Artist?)null);
            
        // One genre not found
        _genreRepository.CountAsync(Arg.Any<System.Linq.Expressions.Expression<System.Func<Genre, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(0);

        // Act
        Result<string> result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(GenreErrors.NotFound);
    }
}
