using FluentAssertions;
using MusicShop.Application.UseCases.Catalog.Artists.Commands.DeleteArtist;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;
using NSubstitute;

namespace MusicShop.Application.UnitTests.UseCases.Catalog.Artists.Commands.DeleteArtist;

public class DeleteArtistCommandHandlerTests
{
    private readonly IArtistRepository _artistRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly DeleteArtistCommandHandler _handler;

    public DeleteArtistCommandHandlerTests()
    {
        _artistRepository = Substitute.For<IArtistRepository>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _handler = new DeleteArtistCommandHandler(_artistRepository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_Should_ReturnSuccess_When_ArtistExistsAndHasNoReleases()
    {
        // Arrange
        string slug = "test-artist";
        DeleteArtistCommand command = new DeleteArtistCommand(slug);
        Artist artist = new Artist { Id = Guid.NewGuid(), Slug = slug };
        
        _artistRepository.GetWithReleasesBySlugAsync(slug, Arg.Any<CancellationToken>())
            .Returns(artist);

        // Act
        Result result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _artistRepository.Received(1).Delete(artist);
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_When_ArtistNotFound()
    {
        // Arrange
        string slug = "non-existent";
        DeleteArtistCommand command = new DeleteArtistCommand(slug);
        
        _artistRepository.GetWithReleasesBySlugAsync(slug, Arg.Any<CancellationToken>())
            .Returns((Artist?)null);

        // Act
        Result result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ArtistErrors.NotFound);
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_When_ArtistHasReleases()
    {
        // Arrange
        string slug = "active-artist";
        DeleteArtistCommand command = new DeleteArtistCommand(slug);
        Artist artist = new Artist { Id = Guid.NewGuid(), Slug = slug };
        artist.Releases.Add(new Release { Id = Guid.NewGuid() });
        
        _artistRepository.GetWithReleasesBySlugAsync(slug, Arg.Any<CancellationToken>())
            .Returns(artist);

        // Act
        Result result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(ArtistErrors.HasAssociations);
        _artistRepository.DidNotReceive().Delete(Arg.Any<Artist>());
    }
}
