
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

Console.OutputEncoding = System.Text.Encoding.UTF8;
string discogsToken = "YOUR_DISCOGS_TOKEN_HERE";
string basePath = @"d:\Pine tree\MusicShop\src\MusicShop.Infrastructure\Persistence\SeedData";
string csvPath = Path.Combine(basePath, "artists.csv");
string outputDir = Path.Combine(basePath, "artists");

if (!Directory.Exists(outputDir))
{
    Directory.CreateDirectory(outputDir);
}

using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("User-Agent", "MusicShopSeedData/1.0");

List<string> artists = new List<string>();
string[] lines = await File.ReadAllLinesAsync(csvPath);
foreach (string line in lines.Skip(1))
{
    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    if (cols.Length > 0 && !string.IsNullOrWhiteSpace(cols[0]))
    {
        artists.Add(cols[0].Trim('"'));
    }
}

Console.WriteLine($"Starting to download Discogs photos for {artists.Count} artists...");

int successCount = 0;
for (int i = 0; i < artists.Count; i++)
{
    string name = artists[i];
    string slug = Regex.Replace(name.ToLower().Replace(" ", "_"), @"[.'()&,\-]", "").Trim('_');
    string filePath = Path.Combine(outputDir, $"{slug}.jpg");

    Console.WriteLine($"[{i + 1}/{artists.Count}] Finding Discogs photo for: {name}...");

    string query = Uri.EscapeDataString(name);
    string searchUrl = $"https://api.discogs.com/database/search?q={query}&type=artist&token={discogsToken}";

    try
    {
        string searchResp = await httpClient.GetStringAsync(searchUrl);
        await Task.Delay(1500); // Rate limit

        using var searchDoc = JsonDocument.Parse(searchResp);
        JsonElement results = searchDoc.RootElement.GetProperty("results");
        if (results.GetArrayLength() == 0)
        {
            Console.WriteLine(" -> Photo not found on Discogs.");
            continue;
        }

        JsonElement firstResult = results[0];
        if (firstResult.TryGetProperty("cover_image", out JsonElement imgProp))
        {
            string imgUrl = imgProp.GetString();
            if (!string.IsNullOrEmpty(imgUrl) && !imgUrl.EndsWith("spacer.gif"))
            {
                byte[] imageBytes = await httpClient.GetByteArrayAsync(imgUrl);
                await File.WriteAllBytesAsync(filePath, imageBytes);
                Console.WriteLine(" -> Success!");
                successCount++;
                continue;
            }
        }
        Console.WriteLine(" -> Photo not found on Discogs.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($" -> Download error: {ex.Message}");
    }
}

Console.WriteLine($"Done! Downloaded {successCount} new artist photos from Discogs.");
