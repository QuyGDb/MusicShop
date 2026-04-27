using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

Console.OutputEncoding = System.Text.Encoding.UTF8;
string basePath = @"d:\Pine tree\MusicShop\src\MusicShop.Infrastructure\Persistence\SeedData";
string releasesPath = Path.Combine(basePath, "releases.csv");
string outputDir = Path.Combine(basePath, "releases");

if (!Directory.Exists(outputDir)) Directory.CreateDirectory(outputDir);

static string ToSlug(string title) =>
    Regex.Replace(title.ToLower().Replace(" ", "_"), @"[^a-z0-9_]", "").Trim('_');

// Read releases: Title + ArtistName
List<(string Title, string Artist)> releases = new List<(string, string)>();
foreach (string line in (await File.ReadAllLinesAsync(releasesPath)).Skip(1))
{
    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    if (cols.Length >= 5)
    {
        string title = cols[0].Trim('"');
        string artist = cols[4].Trim('"');
        string slug = ToSlug(title);
        string filePath = Path.Combine(outputDir, $"{slug}.jpg");
        // Skip if already downloaded
        if (!File.Exists(filePath))
            releases.Add((title, artist));
    }
}

Console.WriteLine($"Downloading cover art for {releases.Count} releases (iTunes API)...");
Console.WriteLine();

using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("User-Agent", "MusicShopSeedData/1.0");

int successCount = 0;
int skipCount = 0;

for (int i = 0; i < releases.Count; i++)
{
    (string title, string artist) = releases[i];
    string slug = ToSlug(title);
    string filePath = Path.Combine(outputDir, $"{slug}.jpg");

    Console.Write($"[{i + 1}/{releases.Count}] {artist} — {title} ... ");

    try
    {
        string query = Uri.EscapeDataString($"{artist} {title}");
        string searchUrl = $"https://itunes.apple.com/search?term={query}&entity=album&limit=5";
        string searchResp = await httpClient.GetStringAsync(searchUrl);
        await Task.Delay(200);

        string? artworkUrl = null;
        using (JsonDocument searchDoc = JsonDocument.Parse(searchResp))
        {
            JsonElement results = searchDoc.RootElement.GetProperty("results");

            foreach (JsonElement r in results.EnumerateArray())
            {
                string albumName = r.TryGetProperty("collectionName", out JsonElement n) ? n.GetString() ?? "" : "";
                string artistName = r.TryGetProperty("artistName", out JsonElement a) ? a.GetString() ?? "" : "";

                // Require rough match on both artist and title
                if (!artistName.Contains(artist, StringComparison.OrdinalIgnoreCase)
                    && !artist.Contains(artistName, StringComparison.OrdinalIgnoreCase)) continue;

                if (r.TryGetProperty("artworkUrl100", out JsonElement art))
                {
                    // Scale up: 100x100bb → 600x600bb
                    artworkUrl = art.GetString()?.Replace("100x100bb", "600x600bb");
                    break;
                }
            }
        }

        if (artworkUrl == null)
        {
            Console.WriteLine("Not found.");
            skipCount++;
            continue;
        }

        byte[] imageBytes = await httpClient.GetByteArrayAsync(artworkUrl);
        await File.WriteAllBytesAsync(filePath, imageBytes);
        Console.WriteLine("OK");
        successCount++;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
        skipCount++;
    }
}

Console.WriteLine();
Console.WriteLine($"Done! {successCount} downloaded, {skipCount} not found.");
