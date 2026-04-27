# CrawlData Scripts

Scripts C# độc lập để xây dựng Seed Data cho cửa hàng âm nhạc. Chạy trực tiếp bằng .NET 10 mà không cần project file.

## Thứ tự chạy (BẮT BUỘC tuần tự)

```
STEP 1  DiscoverReleases.cs      — Tìm album từ artists.csv → ghi releases.csv
STEP 2  EnrichRealData.cs        — Lấy Vinyl/CD/Cassette version từ Discogs → ghi release_versions.csv + product.csv
STEP 3  DownloadTracks.cs        — Lấy tracklist từ Discogs → ghi tracks.csv
STEP 4  DownloadArtistImages.cs  — Tải ảnh nghệ sĩ → lưu vào local
STEP 5  DownloadReleaseImages.cs — Tải ảnh bìa album → lưu vào local
STEP 6  DownloadProductImages.cs — Tải ảnh vật lý (CD/Vinyl) → lưu vào local
STEP 7  UploadArtistImages.cs    — Upload ảnh nghệ sĩ lên API → cập nhật artists.csv
STEP 8  UploadReleaseImages.cs   — Upload ảnh album lên API → cập nhật releases.csv
STEP 9  UploadProductImages.cs   — Upload ảnh đĩa lên API → cập nhật product.csv
```

### Chạy từ thư mục CrawlData

```powershell
cd "d:\Pine tree\MusicShop\CrawlData"

dotnet DiscoverReleases.cs
dotnet EnrichRealData.cs
dotnet DownloadTracks.cs
dotnet DownloadArtistImages.cs
dotnet DownloadReleaseImages.cs
dotnet DownloadProductImages.cs

# Lưu ý: API (MusicShop.API) phải đang chạy để thực hiện các bước upload
dotnet UploadArtistImages.cs
dotnet UploadReleaseImages.cs
dotnet UploadProductImages.cs
```

> **Lưu ý**: Các script được thiết kế để chạy lại nhiều lần mà không bị trùng dữ liệu (idempotent).  
> Script sau phụ thuộc vào output của script trước — **không được đảo thứ tự**.

---

## Luồng dữ liệu

```
artists.csv
    ↓ [DiscoverReleases.cs — iTunes API]
releases.csv
    ↓ [EnrichRealData.cs — Discogs API]
release_versions.csv  +  product.csv
    ↓ [DownloadTracks.cs — Discogs API]
tracks.csv
    ↓ [DownloadArtistImages / DownloadReleaseImages / DownloadProductImages]
Local Images (SeedData/artists, releases, products)
    ↓ [UploadXXXImages.cs — MusicShop API]
Updated CSVs with ImageUrl (CloudFront)
```

---

## Mô tả từng script

| Script | API | Input | Output |
|--------|-----|-------|--------|
| `DiscoverReleases.cs` | iTunes Search API | `artists.csv` | `releases.csv` |
| `EnrichRealData.cs` | Discogs API | `releases.csv` | `release_versions.csv`, `product.csv` |
| `DownloadTracks.cs` | Discogs API | `releases.csv` | `tracks.csv` |
| `DownloadArtistImages.cs` | Discogs API | `artists.csv` | `SeedData/artists/` |
| `DownloadReleaseImages.cs`| iTunes API | `releases.csv` | `SeedData/releases/` |
| `DownloadProductImages.cs`| Discogs API | `product.csv` | `SeedData/products/` |
| `UploadArtistImages.cs` | MusicShop API | `artists.csv` | `artists.csv` (ImageUrl) |
| `UploadReleaseImages.cs`| MusicShop API | `releases.csv` | `releases.csv` (ImageUrl) |
| `UploadProductImages.cs` | MusicShop API | `product.csv` | `product.csv` (ImageUrl) |
