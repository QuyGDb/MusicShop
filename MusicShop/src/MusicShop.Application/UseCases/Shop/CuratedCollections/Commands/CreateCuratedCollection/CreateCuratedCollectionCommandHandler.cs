using MediatR;
using MusicShop.Application.Common.Interfaces;
using MusicShop.Domain.Common;
using MusicShop.Domain.Entities.Shop;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.CreateCuratedCollection;

public sealed class CreateCuratedCollectionCommandHandler(ICuratedCollectionRepository repository)
    : IRequestHandler<CreateCuratedCollectionCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(CreateCuratedCollectionCommand request, CancellationToken cancellationToken)
    {
        CuratedCollection curatedCollection = new CuratedCollection
        {
            Title = request.Title,
            Description = request.Description,
            IsPublished = false
        };

        await repository.AddAsync(curatedCollection, cancellationToken);

        return Result<Guid>.Success(curatedCollection.Id);
    }
}
