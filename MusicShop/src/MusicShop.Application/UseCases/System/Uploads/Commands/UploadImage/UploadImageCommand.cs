using MediatR;
using MusicShop.Domain.Common;
using System.IO;

namespace MusicShop.Application.UseCases.System.Uploads.Commands.UploadImage;

public record UploadImageCommand(
    Stream FileStream,
    string FileName,
    string ContentType,
    string Folder) : IRequest<Result<string>>;
