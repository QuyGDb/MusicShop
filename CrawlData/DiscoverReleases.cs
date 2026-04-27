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
string artistsPath = Path.Combine(basePath, "artists.csv");
string releasesPath = Path.Combine(basePath, "releases.csv");

Random rnd = new Random();

// Skip variants/reissues
static bool IsVariant(string title) =>
    Regex.IsMatch(title, @"\b(deluxe|remaster(ed)?|live|edition|anniversary|bonus|reissue|compilation|greatest hits|best of)\b", RegexOptions.IgnoreCase);

// Normalize for deduplication: strip parentheticals and version suffixes
static string NormalizeTitle(string title)
{
    string result = Regex.Replace(title, @"\s*\(.*?\)\s*$", "");
    return result.Trim().ToLower();
}

static string EscapeCsv(string value) =>
    (value.Contains(',') || value.Contains('"'))
        ? $"\"{value.Replace("\"", "\"\"")}\""
        : value;

// 1. Read existing releases
HashSet<string> existingExact = new HashSet<string>();
HashSet<string> existingNorm = new HashSet<string>();
if (File.Exists(releasesPath))
{
    foreach (string line in (await File.ReadAllLinesAsync(releasesPath)).Skip(1))
    {
        string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        if (cols.Length > 0)
        {
            string title = cols[0].Trim('"');
            existingExact.Add(title.ToLower());
            existingNorm.Add(NormalizeTitle(title));
        }
    }
}
else
{
    await File.WriteAllTextAsync(releasesPath, "Title,Slug,Year,Description,ArtistName,Genres\n");
}

// 2. Read artists
List<string> artists = new List<string>();
foreach (string line in (await File.ReadAllLinesAsync(artistsPath)).Skip(1))
{
    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    if (cols.Length > 0) artists.Add(cols[0].Trim('"'));
}

Console.WriteLine($"Discovering albums for {artists.Count} artists (iTunes API)...");
Console.WriteLine("Limit: 1–3 albums per artist (randomized)");
Console.WriteLine();

using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("User-Agent", "MusicShopSeedData/1.0");

using var writer = new StreamWriter(releasesPath, append: true, System.Text.Encoding.UTF8);

foreach (string artistName in artists)
{
    Console.WriteLine($"[Artist] {artistName}");

    try
    {
        string searchUrl = $"https://itunes.apple.com/search?term={Uri.EscapeDataString(artistName)}&entity=album&limit=100";
        string searchResp = await httpClient.GetStringAsync(searchUrl);
        await Task.Delay(300);

        List<(string Title, int Year, string Genre)> candidates;
        using (JsonDocument searchDoc = JsonDocument.Parse(searchResp))
        {
            JsonElement results = searchDoc.RootElement.GetProperty("results");
            candidates = results.EnumerateArray()
                .Where(r => r.TryGetProperty("collectionName", out _)
                         && r.TryGetProperty("releaseDate", out _)
                         && r.TryGetProperty("artistName", out _))
                .Select(r =>
                {
                    string title = r.GetProperty("collectionName").GetString() ?? "";
                    int year = DateTime.TryParse(r.GetProperty("releaseDate").GetString(), out DateTime dt) ? dt.Year : 0;
                    string genre = r.TryGetProperty("primaryGenreName", out JsonElement g) ? g.GetString() ?? "Unknown" : "Unknown";
                    string artist = r.GetProperty("artistName").GetString() ?? "";
                    return (title, year, genre, artist);
                })
                // Only this artist's releases
                .Where(a => a.artist.Contains(artistName, StringComparison.OrdinalIgnoreCase))
                // Albums only — skip entries ending in "- EP" or "- Single"
                .Where(a => !Regex.IsMatch(a.title, @"-\s*(EP|Single)\s*$", RegexOptions.IgnoreCase))
                // Skip variants/reissues
                .Where(a => !IsVariant(a.title))
                .OrderBy(a => a.year)
                .Select(a => (a.title, a.year, a.genre))
                .ToList();
        }

        int maxForThisArtist = rnd.Next(1, 4); // 1, 2, or 3
        int albumsAdded = 0;
        foreach ((string title, int year, string genre) in candidates)
        {
            if (albumsAdded >= maxForThisArtist) break;
            if (existingExact.Contains(title.ToLower())) continue;
            if (existingNorm.Contains(NormalizeTitle(title))) continue;

            existingExact.Add(title.ToLower());
            existingNorm.Add(NormalizeTitle(title));

            string slug = Regex.Replace(title.ToLower().Replace(" ", "-"), @"[^a-z0-9\-]", "");
            string desc = $"\"{title} is an album by {artistName} released in {year}.\"";

            await writer.WriteLineAsync($"{EscapeCsv(title)},{slug},{year},{desc},{EscapeCsv(artistName)},{EscapeCsv(genre)}");
            Console.WriteLine($" -> {title} ({year})");
            albumsAdded++;
        }

        if (albumsAdded == 0) Console.WriteLine(" -> No new albums found.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($" -> Error: {ex.Message}");
    }
}

Console.WriteLine();
Console.WriteLine("Discovery complete!");
