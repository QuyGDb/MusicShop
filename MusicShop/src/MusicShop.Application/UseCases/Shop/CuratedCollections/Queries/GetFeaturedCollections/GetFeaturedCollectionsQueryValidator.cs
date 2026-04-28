using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Queries.GetFeaturedCollections;

public sealed class GetFeaturedCollectionsQueryValidator : AbstractValidator<GetFeaturedCollectionsQuery>
{
    public GetFeaturedCollectionsQueryValidator()
    {
        RuleFor(x => x.Count)
            .GreaterThanOrEqualTo(1).WithMessage("Count must be at least 1.")
            .LessThanOrEqualTo(20).WithMessage("Count must not exceed 20.");
    }
}
