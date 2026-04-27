using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

Console.OutputEncoding = System.Text.Encoding.UTF8;

string baseUrl = "http://localhost:5000";
string loginUrl = $"{baseUrl}/api/v1/auth/login";
string uploadUrl = $"{baseUrl}/api/v1/uploads/image?folder=releases";

string basePath = @"d:\Pine tree\MusicShop\src\MusicShop.Infrastructure\Persistence\SeedData";
string csvPath = Path.Combine(basePath, "releases.csv");
string imagesDir = Path.Combine(basePath, "releases");

using var httpClient = new HttpClient();

// 1. Login as Admin
Console.WriteLine("Logging in as admin...");
string loginJson = "{\"email\":\"admin@musicshop.com\",\"password\":\"Admin@123\"}";
using var loginContent = new StringContent(loginJson, Encoding.UTF8, "application/json");
var loginResponse = await httpClient.PostAsync(loginUrl, loginContent);

if (!loginResponse.IsSuccessStatusCode)
{
    string error = await loginResponse.Content.ReadAsStringAsync();
    Console.WriteLine($"Login failed: {loginResponse.StatusCode}\n{error}");
    return;
}

string loginResultStr = await loginResponse.Content.ReadAsStringAsync();
using var loginDoc = JsonDocument.Parse(loginResultStr);
string token = loginDoc.RootElement.GetProperty("data").GetProperty("accessToken").GetString() ?? "";
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

Console.WriteLine("Login successful!");

// 2. Read releases.csv
string[] lines = await File.ReadAllLinesAsync(csvPath);
if (lines.Length == 0) return;

string header = lines[0];
bool hasImageUrlColumn = header.Contains("ImageUrl");
if (!hasImageUrlColumn)
{
    header += ",ImageUrl";
}

List<string> updatedLines = new List<string> { header };
int successCount = 0;

Console.WriteLine($"Starting to upload release images for {lines.Length - 1} records...");

for (int i = 1; i < lines.Length; i++)
{
    string line = lines[i];
    if (string.IsNullOrWhiteSpace(line)) continue;

    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    string title = cols[0].Trim('"');
    
    // Slug logic from DownloadReleaseImages.cs: Regex.Replace(title.ToLower().Replace(" ", "_"), @"[^a-z0-9_]", "").Trim('_');
    string slug = Regex.Replace(title.ToLower().Replace(" ", "_"), @"[^a-z0-9_]", "").Trim('_');
    
    string imagePath = Path.Combine(imagesDir, $"{slug}.jpg");
    string imageUrl = "";

    if (File.Exists(imagePath))
    {
        Console.Write($"[{i}/{lines.Length - 1}] Uploading image for {title}... ");
        try
        {
            using var content = new MultipartFormDataContent();
            using var fileStream = File.OpenRead(imagePath);
            var streamContent = new StreamContent(fileStream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            content.Add(streamContent, "file", Path.GetFileName(imagePath));

            var uploadResponse = await httpClient.PostAsync(uploadUrl, content);
            if (uploadResponse.IsSuccessStatusCode)
            {
                string uploadResultStr = await uploadResponse.Content.ReadAsStringAsync();
                using var uploadDoc = JsonDocument.Parse(uploadResultStr);
                imageUrl = uploadDoc.RootElement.GetProperty("data").GetString() ?? "";
                Console.WriteLine("Done!");
                successCount++;
            }
            else
            {
                string error = await uploadResponse.Content.ReadAsStringAsync();
                Console.WriteLine($"Failed ({uploadResponse.StatusCode}): {error}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
    else
    {
        Console.WriteLine($"[{i}/{lines.Length - 1}] Image not found for {title} ({slug}.jpg)");
    }

    // Reconstruct line
    // releases.csv has 6 columns: Title,Slug,Year,Description,ArtistName,Genres
    if (hasImageUrlColumn)
    {
        if (cols.Length >= 7)
        {
            cols[6] = $"\"{imageUrl}\"";
            updatedLines.Add(string.Join(",", cols));
        }
        else
        {
            updatedLines.Add($"{line},\"{imageUrl}\"");
        }
    }
    else
    {
        updatedLines.Add($"{line},\"{imageUrl}\"");
    }
}

// 3. Save updated CSV
await File.WriteAllLinesAsync(csvPath, updatedLines);
Console.WriteLine($"\nFinished! Uploaded {successCount} release images. CSV updated at {csvPath}");
