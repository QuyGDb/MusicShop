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
string csvPath = Path.Combine(basePath, "product.csv");
string outputDir = Path.Combine(basePath, "products");

if (!Directory.Exists(outputDir))
{
    Directory.CreateDirectory(outputDir);
}

using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("User-Agent", "MusicShopSeedData/1.0");

List<(string Title, string Version)> products = new List<(string Title, string Version)>();
string[] lines = await File.ReadAllLinesAsync(csvPath);
foreach (string line in lines.Skip(1))
{
    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    if (cols.Length >= 2 && !string.IsNullOrWhiteSpace(cols[0]) && !string.IsNullOrWhiteSpace(cols[1]))
    {
        products.Add((cols[0].Trim('"'), cols[1].Trim('"')));
    }
}

Console.WriteLine($"Starting to download physical photos via Discogs for {products.Count} products...");

int successCount = 0;
for (int i = 0; i < products.Count; i++)
{
    (string title, string version) = products[i];
    string fullName = $"{title} - {version}";
    string slug = Regex.Replace(fullName.ToLower().Replace(" ", "_"), @"[.'()&,\-]", "").Trim('_');
    string filePath = Path.Combine(outputDir, $"{slug}.jpg");
    
    Console.WriteLine($"[{i + 1}/{products.Count}] Finding photo on Discogs: {fullName}...");
    
    string formatFilter = "";
    string vLower = version.ToLower();
    if (vLower.Contains("vinyl") || vLower.Contains("pressing")) formatFilter = "&format=Vinyl";
    else if (vLower.Contains("cd")) formatFilter = "&format=CD";
    else if (vLower.Contains("cassette")) formatFilter = "&format=Cassette";
    
    string query = Uri.EscapeDataString(title);
    string searchUrl = $"https://api.discogs.com/database/search?release_title={query}{formatFilter}&token={discogsToken}";
    string fallbackUrl = $"https://api.discogs.com/database/search?q={query}&token={discogsToken}";
    
    string imgUrl = null;
    
    try
    {
        string searchResp = await httpClient.GetStringAsync(searchUrl);
        await Task.Delay(1500); // Rate limit
        
        using var searchDoc = JsonDocument.Parse(searchResp);
        JsonElement results = searchDoc.RootElement.GetProperty("results");
        
        if (results.GetArrayLength() > 0)
        {
            JsonElement firstResult = results[0];
            if (firstResult.TryGetProperty("cover_image", out JsonElement imgProp))
            {
                string url = imgProp.GetString();
                if (!string.IsNullOrEmpty(url) && !url.EndsWith("spacer.gif")) imgUrl = url;
            }
        }
        
        if (imgUrl == null && !string.IsNullOrEmpty(formatFilter))
        {
            // Fallback
            string fallResp = await httpClient.GetStringAsync(fallbackUrl);
            await Task.Delay(1500);
            using var fallDoc = JsonDocument.Parse(fallResp);
            JsonElement fallResults = fallDoc.RootElement.GetProperty("results");
            if (fallResults.GetArrayLength() > 0)
            {
                JsonElement firstFall = fallResults[0];
                if (firstFall.TryGetProperty("cover_image", out JsonElement imgProp))
                {
                    string url = imgProp.GetString();
                    if (!string.IsNullOrEmpty(url) && !url.EndsWith("spacer.gif")) imgUrl = url;
                }
            }
        }
        
        if (imgUrl != null)
        {
            byte[] imageBytes = await httpClient.GetByteArrayAsync(imgUrl);
            await File.WriteAllBytesAsync(filePath, imageBytes);
            Console.WriteLine(" -> Success!");
            successCount++;
        }
        else
        {
            Console.WriteLine(" -> Photo not found on Discogs.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($" -> Error: {ex.Message}");
    }
}

Console.WriteLine($"Done! Downloaded {successCount} new physical photos from Discogs.");
