using FluentValidation;

namespace MusicShop.Application.UseCases.Shop.CuratedCollections.Commands.UpdateCuratedCollectionStatus;

public sealed class UpdateCuratedCollectionStatusCommandValidator : AbstractValidator<UpdateCuratedCollectionStatusCommand>
{
    public UpdateCuratedCollectionStatusCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}
