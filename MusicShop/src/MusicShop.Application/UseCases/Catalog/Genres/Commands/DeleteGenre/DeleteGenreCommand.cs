using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Genres.Commands.DeleteGenre;

public record DeleteGenreCommand(Guid Id) : IRequest<Result>;
