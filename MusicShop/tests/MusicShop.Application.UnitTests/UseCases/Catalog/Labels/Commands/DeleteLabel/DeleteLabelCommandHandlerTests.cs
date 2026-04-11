using FluentAssertions;
using MusicShop.Application.UseCases.Catalog.Labels.Commands.DeleteLabel;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Catalog;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Interfaces;
using MusicShop.Domain.Errors;
using NSubstitute;

namespace MusicShop.Application.UnitTests.UseCases.Catalog.Labels.Commands.DeleteLabel;

public class DeleteLabelCommandHandlerTests
{
    private readonly ILabelRepository _labelRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly DeleteLabelCommandHandler _handler;

    public DeleteLabelCommandHandlerTests()
    {
        _labelRepository = Substitute.For<ILabelRepository>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _handler = new DeleteLabelCommandHandler(_labelRepository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_Should_ReturnSuccess_When_LabelExistsAndHasNoVersions()
    {
        // Arrange
        string slug = "test-label";
        DeleteLabelCommand command = new DeleteLabelCommand(slug);
        Label label = new Label { Id = Guid.NewGuid(), Slug = slug };
        
        _labelRepository.GetWithVersionsBySlugAsync(slug, Arg.Any<CancellationToken>())
            .Returns(label);

        // Act
        Result result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        _labelRepository.Received(1).Delete(label);
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_When_LabelNotFound()
    {
        // Arrange
        string slug = "non-existent";
        DeleteLabelCommand command = new DeleteLabelCommand(slug);
        
        _labelRepository.GetWithVersionsBySlugAsync(slug, Arg.Any<CancellationToken>())
            .Returns((Label?)null);

        // Act
        Result result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(LabelErrors.NotFound);
    }

    [Fact]
    public async Task Handle_Should_ReturnFailure_When_LabelHasVersions()
    {
        // Arrange
        var slug = "active-label";
        DeleteLabelCommand command = new DeleteLabelCommand(slug);
        Label label = new Label { Id = Guid.NewGuid(), Slug = slug };
        label.ReleaseVersions.Add(new ReleaseVersion { Id = Guid.NewGuid() });
        
        _labelRepository.GetWithVersionsBySlugAsync(slug, Arg.Any<CancellationToken>())
            .Returns(label);

        // Act
        Result result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(LabelErrors.HasAssociations);
        _labelRepository.DidNotReceive().Delete(Arg.Any<Label>());
    }
}
