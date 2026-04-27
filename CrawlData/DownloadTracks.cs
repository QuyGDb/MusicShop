using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

Console.OutputEncoding = System.Text.Encoding.UTF8;
string discogsToken = "YOUR_DISCOGS_TOKEN_HERE";
string basePath = @"d:\Pine tree\MusicShop\src\MusicShop.Infrastructure\Persistence\SeedData";
string releasesPath = Path.Combine(basePath, "releases.csv");
string tracksPath = Path.Combine(basePath, "tracks.csv");

// 1. Get valid releases from releases.csv
HashSet<string> validReleaseTitles = new HashSet<string>();
string[] releaseLines = await File.ReadAllLinesAsync(releasesPath);
foreach (string line in releaseLines.Skip(1))
{
    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    if (cols.Length > 0) validReleaseTitles.Add(cols[0].Trim('"'));
}

// 2. Sync and clean tracks.csv (Remove orphaned tracks)
List<string> filteredTracks = new List<string>();
string tHeader = "ReleaseTitle,Position,Title,Side,DurationSeconds";
filteredTracks.Add(tHeader);
HashSet<string> existingTrackReleases = new HashSet<string>();

if (File.Exists(tracksPath))
{
    foreach (string line in (await File.ReadAllLinesAsync(tracksPath)).Skip(1))
    {
        string[] cols = line.Split(',');
        if (cols.Length > 0)
        {
            string title = cols[0].Trim('"');
            if (validReleaseTitles.Contains(title))
            {
                filteredTracks.Add(line);
                existingTrackReleases.Add(title);
            }
        }
    }
}
await File.WriteAllLinesAsync(tracksPath, filteredTracks);

// 3. Identify missing tracks
List<(string Title, string Artist)> missingTracks = new List<(string Title, string Artist)>();
foreach (string line in releaseLines.Skip(1))
{
    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    if (cols.Length >= 5)
    {
        string title = cols[0].Trim('"');
        string artist = cols[4].Trim('"');
        if (!existingTrackReleases.Contains(title))
            missingTracks.Add((title, artist));
    }
}

Console.WriteLine($"Found {missingTracks.Count} releases missing tracks. Fetching from Discogs...");

using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("User-Agent", "MusicShopSeedData/1.0");

using var writer = new StreamWriter(tracksPath, true, System.Text.Encoding.UTF8);

for (int i = 0; i < missingTracks.Count; i++)
{
    (string Title, string Artist) release = missingTracks[i];
    Console.WriteLine($"[{i + 1}/{missingTracks.Count}] Fetching tracklist for: {release.Artist} - {release.Title}");

    string query = Uri.EscapeDataString($"{release.Artist} {release.Title}");

    try
    {
        // Extract masterId first while searchDoc is alive
        string searchResp = await httpClient.GetStringAsync(
            $"https://api.discogs.com/database/search?q={query}&type=master&token={discogsToken}");
        await Task.Delay(1200);

        int masterId = 0;
        using (JsonDocument searchDoc = JsonDocument.Parse(searchResp))
        {
            JsonElement results = searchDoc.RootElement.GetProperty("results");
            if (results.GetArrayLength() > 0)
                masterId = results[0].GetProperty("master_id").GetInt32();
        }
        // searchDoc disposed — masterId (int) is safe

        // Extract tracks into plain records while each document is alive
        List<(string Pos, string TrackTitle, string Duration)> rawTracks = new List<(string, string, string)>();

        if (masterId > 0)
        {
            string masterResp = await httpClient.GetStringAsync(
                $"https://api.discogs.com/masters/{masterId}?token={discogsToken}");
            await Task.Delay(1200);

            using (JsonDocument masterDoc = JsonDocument.Parse(masterResp))
            {
                JsonElement tracklist = masterDoc.RootElement.GetProperty("tracklist");
                foreach (JsonElement track in tracklist.EnumerateArray())
                {
                    string type = track.TryGetProperty("type_", out JsonElement tProp) ? tProp.GetString() ?? "" : "";
                    if (type == "heading") continue;
                    string pos = track.TryGetProperty("position", out JsonElement pProp) ? pProp.GetString() ?? "" : "";
                    string trackTitle = track.TryGetProperty("title", out JsonElement nProp) ? nProp.GetString() ?? "Unknown Track" : "Unknown Track";
                    string dur = track.TryGetProperty("duration", out JsonElement dProp) ? dProp.GetString() ?? "" : "";
                    rawTracks.Add((pos, trackTitle, dur));
                }
            }
        }
        else
        {
            // Fallback: search by release
            string relResp = await httpClient.GetStringAsync(
                $"https://api.discogs.com/database/search?q={query}&type=release&token={discogsToken}");
            await Task.Delay(1200);

            string releaseId = "";
            using (JsonDocument relDoc = JsonDocument.Parse(relResp))
            {
                JsonElement relResults = relDoc.RootElement.GetProperty("results");
                if (relResults.GetArrayLength() > 0)
                    releaseId = relResults[0].GetProperty("id").ToString();
            }

            if (!string.IsNullOrEmpty(releaseId))
            {
                string resResp = await httpClient.GetStringAsync(
                    $"https://api.discogs.com/releases/{releaseId}?token={discogsToken}");
                await Task.Delay(1200);

                using (JsonDocument resDoc = JsonDocument.Parse(resResp))
                {
                    JsonElement tracklist = resDoc.RootElement.GetProperty("tracklist");
                    foreach (JsonElement track in tracklist.EnumerateArray())
                    {
                        string type = track.TryGetProperty("type_", out JsonElement tProp) ? tProp.GetString() ?? "" : "";
                        if (type == "heading") continue;
                        string pos = track.TryGetProperty("position", out JsonElement pProp) ? pProp.GetString() ?? "" : "";
                        string trackTitle = track.TryGetProperty("title", out JsonElement nProp) ? nProp.GetString() ?? "Unknown Track" : "Unknown Track";
                        string dur = track.TryGetProperty("duration", out JsonElement dProp) ? dProp.GetString() ?? "" : "";
                        rawTracks.Add((pos, trackTitle, dur));
                    }
                }
            }
        }

        if (rawTracks.Count == 0)
        {
            Console.WriteLine(" -> Tracklist not found. Skipping.");
            continue;
        }

        // Now all JsonDocuments are disposed — safe to write using only plain strings
        string releaseTitleEscaped = release.Title.Contains(',') || release.Title.Contains('"')
            ? $"\"{release.Title.Replace("\"", "\"\"")}\""
            : release.Title;

        int globalPos = 1;
        foreach ((string pos, string trackTitle, string dur) in rawTracks)
        {
            string durSec = "";
            if (!string.IsNullOrEmpty(dur))
            {
                string[] parts = dur.Split(':');
                if (parts.Length == 2 && int.TryParse(parts[0], out int m) && int.TryParse(parts[1], out int s))
                    durSec = (m * 60 + s).ToString();
            }

            string side = "";
            Match match = Regex.Match(pos, @"^([A-Z]+)(\d*)$", RegexOptions.IgnoreCase);
            if (match.Success) side = match.Groups[1].Value.ToUpper();

            string escapedTitle = trackTitle.Contains(',') || trackTitle.Contains('"')
                ? $"\"{trackTitle.Replace("\"", "\"\"")}\""
                : trackTitle;

            await writer.WriteLineAsync($"{releaseTitleEscaped},{globalPos},{escapedTitle},{side},{durSec}");
            globalPos++;
        }
        Console.WriteLine($" -> Added {rawTracks.Count} tracks.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($" -> Error: {ex.Message}");
    }
}
Console.WriteLine("Done!");
