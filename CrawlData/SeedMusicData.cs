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
string versionsPath = Path.Combine(basePath, "release_versions.csv");
string productsPath = Path.Combine(basePath, "product.csv");

// --- Helpers ---
static string[] SplitCsvLine(string line)
    => Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

static string EscapeCsv(string value)
    => (value.Contains(',') || value.Contains('"'))
        ? $"\"{value.Replace("\"", "\"\"")}\""
        : value;

static string SafeLabel(JsonElement element)
{
    if (element.ValueKind == JsonValueKind.Array)
    {
        if (element.GetArrayLength() == 0) return "Unknown Label";
        return element[0].GetString() ?? "Unknown Label";
    }
    return element.GetString() ?? "Unknown Label";
}

static string SafeYear(JsonElement v, string fallbackYear)
{
    if (v.TryGetProperty("year", out JsonElement yr))
    {
        string yearStr = yr.ToString();
        if (yearStr != "0" && !string.IsNullOrEmpty(yearStr)) return yearStr;
    }
    if (v.TryGetProperty("released", out JsonElement rel))
    {
        string released = rel.GetString() ?? "";
        if (!string.IsNullOrEmpty(released) && released != "0") return released;
    }
    return fallbackYear;
}

// STEP 1: Build dictionary of valid releases
Dictionary<string, (string Artist, string Year)> validReleases = new();
foreach (string line in (await File.ReadAllLinesAsync(releasesPath)).Skip(1))
{
    string[] cols = SplitCsvLine(line);
    if (cols.Length >= 5)
        validReleases[cols[0].Trim('"')] = (cols[4].Trim('"'), cols[2].Trim('"'));
}

// STEP 2: Sync release_versions.csv (Orphan removal)
List<string> filteredVersions = new() { "ReleaseTitle,VersionName,LabelName,Format,PressingCountry,PressingYear,CatalogNumber,Notes" };
HashSet<string> existingVersionKeys = new();
if (File.Exists(versionsPath))
{
    foreach (string line in (await File.ReadAllLinesAsync(versionsPath)).Skip(1))
    {
        string[] cols = SplitCsvLine(line);
        if (cols.Length >= 2)
        {
            string title = cols[0].Trim('"');
            string version = cols[1].Trim('"');
            if (validReleases.ContainsKey(title))
            {
                filteredVersions.Add(line);
                existingVersionKeys.Add($"{title}|{version}");
            }
        }
    }
}
await File.WriteAllLinesAsync(versionsPath, filteredVersions);

// STEP 3: Sync product.csv (Orphan removal + New Header)
List<string> filteredProducts = new() { "ReleaseTitle,VersionName,Price,StockQty,IsLimited,LimitedQty,IsPreorder,PreorderReleaseDate,IsSigned,DisplayName" };
if (File.Exists(productsPath))
{
    foreach (string line in (await File.ReadAllLinesAsync(productsPath)).Skip(1))
    {
        string[] cols = SplitCsvLine(line);
        if (cols.Length >= 1 && validReleases.ContainsKey(cols[0].Trim('"')))
            filteredProducts.Add(line);
    }
}
await File.WriteAllLinesAsync(productsPath, filteredProducts);

// STEP 4: Identify missing releases
List<(string Title, string Artist, string Year)> missingReleases = validReleases
    .Where(r => !existingVersionKeys.Any(k => k.StartsWith(r.Key + "|")))
    .Select(r => (r.Key, r.Value.Artist, r.Value.Year))
    .ToList();

Console.WriteLine($"Found {missingReleases.Count} releases missing versions. Fetching from Discogs...");

using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("User-Agent", "MusicShopSeedData/1.0");
Random rnd = new Random();

using var vWriter = new StreamWriter(versionsPath, append: true, System.Text.Encoding.UTF8);
using var pWriter = new StreamWriter(productsPath, append: true, System.Text.Encoding.UTF8);

for (int i = 0; i < missingReleases.Count; i++)
{
    var release = missingReleases[i];
    Console.WriteLine($"[{i + 1}/{missingReleases.Count}] {release.Artist} - {release.Title}");

    try
    {
        string query = Uri.EscapeDataString($"{release.Artist} {release.Title}");
        string searchResp = await httpClient.GetStringAsync($"https://api.discogs.com/database/search?q={query}&type=master&token={discogsToken}");
        await Task.Delay(1200);

        List<(string Label, string Country, string Year, string CatNo, string Type)> versionsToProcess = new();

        using (JsonDocument searchDoc = JsonDocument.Parse(searchResp))
        {
            JsonElement results = searchDoc.RootElement.GetProperty("results");
            int masterId = results.GetArrayLength() > 0 ? results[0].GetProperty("master_id").GetInt32() : 0;

            if (masterId > 0)
            {
                string vResp = await httpClient.GetStringAsync($"https://api.discogs.com/masters/{masterId}/versions?per_page=100&token={discogsToken}");
                await Task.Delay(1200);
                using JsonDocument vDoc = JsonDocument.Parse(vResp);
                JsonElement versions = vDoc.RootElement.GetProperty("versions");

                JsonElement? vVinyl = null, vCD = null, vCassette = null;
                foreach (JsonElement v in versions.EnumerateArray())
                {
                    string fmt = v.TryGetProperty("format", out JsonElement f) ? f.GetString()?.ToLower() ?? "" : "";
                    if (vVinyl == null && (fmt.Contains("vinyl") || fmt.Contains("lp"))) vVinyl = v;
                    if (vCD == null && fmt.Contains("cd")) vCD = v;
                    if (vCassette == null && (fmt.Contains("cassette") || fmt.Contains("tape"))) vCassette = v;
                }

                if (vVinyl != null) versionsToProcess.Add((SafeLabel(vVinyl.Value.GetProperty("label")), vVinyl.Value.GetProperty("country").GetString() ?? "Unknown", SafeYear(vVinyl.Value, release.Year), vVinyl.Value.GetProperty("catno").GetString() ?? "UNKNOWN", "Vinyl"));
                if (vCD != null) versionsToProcess.Add((SafeLabel(vCD.Value.GetProperty("label")), vCD.Value.GetProperty("country").GetString() ?? "Unknown", SafeYear(vCD.Value, release.Year), vCD.Value.GetProperty("catno").GetString() ?? "UNKNOWN", "CD"));
                if (vCassette != null) versionsToProcess.Add((SafeLabel(vCassette.Value.GetProperty("label")), vCassette.Value.GetProperty("country").GetString() ?? "Unknown", SafeYear(vCassette.Value, release.Year), vCassette.Value.GetProperty("catno").GetString() ?? "UNKNOWN", "Cassette"));
            }
            else
            {
                // FALLBACK: Search for normal release if master not found
                string relResp = await httpClient.GetStringAsync($"https://api.discogs.com/database/search?q={query}&type=release&token={discogsToken}");
                await Task.Delay(1200);
                using JsonDocument relDoc = JsonDocument.Parse(relResp);
                JsonElement relResults = relDoc.RootElement.GetProperty("results");
                if (relResults.GetArrayLength() > 0)
                {
                    JsonElement v = relResults[0];
                    string lbl = SafeLabel(v.TryGetProperty("label", out JsonElement l) ? l : default);
                    string ctry = v.TryGetProperty("country", out JsonElement c) ? c.GetString() ?? "Unknown" : "Unknown";
                    string cat = v.TryGetProperty("catno", out JsonElement cat2) ? cat2.GetString() ?? "UNKNOWN" : "UNKNOWN";
                    versionsToProcess.Add((lbl, ctry, SafeYear(v, release.Year), cat, "Vinyl"));
                }
            }
        }

        if (versionsToProcess.Count == 0)
        {
            Console.WriteLine(" -> No versions found.");
            continue;
        }

        HashSet<string> usedVersionNames = new();
        foreach (var v in versionsToProcess)
        {
            string baseVersionName = v.Country != "Unknown" ? $"{v.Country} {v.Type} Pressing" : $"Original {v.Type} Release";
            string versionName = baseVersionName;
            int suffixNum = 2;
            while (usedVersionNames.Contains(versionName) || existingVersionKeys.Contains($"{release.Title}|{versionName}"))
                versionName = $"{baseVersionName} ({suffixNum++})";
            usedVersionNames.Add(versionName);

            decimal basePrice = v.Type switch { "CD" => 18.00m, "Cassette" => 12.00m, _ => 45.00m };

            // Write Version
            await vWriter.WriteLineAsync($"{EscapeCsv(release.Title)},{EscapeCsv(versionName)},{EscapeCsv(v.Label)},{v.Type},{v.Country},{v.Year},{EscapeCsv(v.CatNo)},Sourced from Discogs");

            // Product 1: Standard
            string name1 = $"{release.Title} - {versionName}";
            await pWriter.WriteLineAsync($"{EscapeCsv(release.Title)},{EscapeCsv(versionName)},{basePrice:F2},{rnd.Next(8, 25)},false,,false,,false,{EscapeCsv(name1)}");

            // Product 2: Sealed
            string name2 = $"{release.Title} - {versionName} [Sealed]";
            decimal sealedPrice = Math.Round(basePrice * 1.6m, 2);
            int sQty = rnd.Next(2, 7);
            await pWriter.WriteLineAsync($"{EscapeCsv(release.Title)},{EscapeCsv(versionName)},{sealedPrice:F2},{sQty},true,{sQty},false,,false,{EscapeCsv(name2)}");

            // Product 3: Signed
            if (rnd.Next(0, 10) < 3)
            {
                string name3 = $"{release.Title} - {versionName} [Signed]";
                decimal signedPrice = Math.Round(basePrice * 2.8m, 2);
                int signQty = rnd.Next(1, 4);
                await pWriter.WriteLineAsync($"{EscapeCsv(release.Title)},{EscapeCsv(versionName)},{signedPrice:F2},{signQty},true,{signQty},false,,true,{EscapeCsv(name3)}");
            }
            Console.WriteLine($" -> Added {versionName} and its products.");
        }
    }
    catch (Exception ex) { Console.WriteLine($" -> Error: {ex.Message}"); }
}
Console.WriteLine("Done!");
