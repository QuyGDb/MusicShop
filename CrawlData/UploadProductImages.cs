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
string uploadUrl = $"{baseUrl}/api/v1/uploads/image?folder=products";

string basePath = @"d:\Pine tree\MusicShop\src\MusicShop.Infrastructure\Persistence\SeedData";
string csvPath = Path.Combine(basePath, "product.csv");
string imagesDir = Path.Combine(basePath, "products");

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

// 2. Read product.csv
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
Dictionary<string, string> uploadedCache = new Dictionary<string, string>();

Console.WriteLine($"Starting to upload product images for {lines.Length - 1} records...");

for (int i = 1; i < lines.Length; i++)
{
    string line = lines[i];
    if (string.IsNullOrWhiteSpace(line)) continue;

    string[] cols = Regex.Split(line, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    if (cols.Length < 2) continue;

    string title = cols[0].Trim('"');
    string version = cols[1].Trim('"');
    
    string fullName = $"{title} - {version}";
    string slug = Regex.Replace(fullName.ToLower().Replace(" ", "_"), @"[.'()&,\-]", "").Trim('_');
    
    string imagePath = Path.Combine(imagesDir, $"{slug}.jpg");
    string imageUrl = "";

    if (uploadedCache.TryGetValue(slug, out string? cachedUrl))
    {
        imageUrl = cachedUrl;
    }
    else if (File.Exists(imagePath))
    {
        Console.Write($"[{i}/{lines.Length - 1}] Uploading image for {fullName}... ");
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
                uploadedCache[slug] = imageUrl;
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
        // Many products share the same image (Sealed vs Normal)
        // So no error message for each row if not found, just skip
    }

    // Reconstruct line
    if (hasImageUrlColumn)
    {
        if (cols.Length >= 11)
        {
            cols[10] = $"\"{imageUrl}\"";
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
Console.WriteLine($"\nFinished! Uploaded {successCount} unique images. CSV updated at {csvPath}");
