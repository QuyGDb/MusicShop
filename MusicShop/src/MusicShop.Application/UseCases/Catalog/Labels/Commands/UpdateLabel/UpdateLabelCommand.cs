using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Labels.Commands.UpdateLabel;

public record UpdateLabelCommand(
    Guid Id,
    string Name, 
    string Slug,
    string? Country, 
    int? FoundedYear, 
    string? Website) : IRequest<Result<string>>;
