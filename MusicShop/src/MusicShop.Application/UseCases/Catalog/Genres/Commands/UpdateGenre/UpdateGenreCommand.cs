using MediatR;
using MusicShop.Application.DTOs.Catalog;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Genres.Commands.UpdateGenre;

public sealed record UpdateGenreCommand(Guid Id, string Name) : IRequest<Result<GenreResponse>>;
