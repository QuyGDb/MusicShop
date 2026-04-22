using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace MusicShop.Application.Common.Interfaces;

public interface IImageService
{
    /// <summary>
    /// Uploads an image to cloud storage and returns the public URL.
    /// </summary>
    /// <param name="fileStream">The file content stream.</param>
    /// <param name="fileName">Original file name.</param>
    /// <param name="contentType">MIME type (e.g. image/jpeg).</param>
    /// <param name="folder">Optional subfolder in the bucket.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The public access URL of the uploaded image.</returns>
    Task<string> UploadImageAsync(
        Stream fileStream, 
        string fileName, 
        string contentType, 
        string folder = "general",
        CancellationToken ct = default);
}
