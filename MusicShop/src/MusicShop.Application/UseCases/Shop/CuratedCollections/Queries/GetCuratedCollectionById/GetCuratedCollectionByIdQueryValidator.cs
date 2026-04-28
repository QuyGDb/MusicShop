using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetCuratedCollectionById;

public sealed class GetCuratedCollectionByIdQueryValidator : AbstractValidator<GetCuratedCollectionByIdQuery>
{
    public GetCuratedCollectionByIdQueryValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}
