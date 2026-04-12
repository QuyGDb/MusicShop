using MediatR;
using MusicShop.Domain.Common;

namespace MusicShop.Application.UseCases.Catalog.Labels.Commands.DeleteLabel;

public record DeleteLabelCommand(Guid Id) : IRequest<Result>;
