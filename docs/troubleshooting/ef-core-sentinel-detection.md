# EF Core Troubleshooting: Sentinel Value Detection & Navigation Fixup

## Hiện tượng (Issue)
Khi thực hiện cập nhật một Entity cha (ví dụ: `Release`) và thay thế danh sách Entity con (ví dụ: `Tracks`) bằng cách `Clear()` và `Add()` mới vào Navigation Collection, EF Core ném ngoại lệ `DbUpdateConcurrencyException` hoặc báo lỗi không tìm thấy bản ghi để Update.

## Nguyên nhân gốc rễ (Root Cause)
Lỗi nằm ở cơ chế **Sentinel Value Detection** của EF Core kết hợp với **Navigation Fixup**.

1. **Sentinel Value**: EF Core dựa vào giá trị mặc định của Primary Key (với GUID là `Guid.Empty`) để xác định một Entity là mới hay cũ.
2. **Lỗi trong BaseEntity**: Trong code cũ, `BaseEntity` khởi tạo `Id = Guid.NewGuid()`. Điều này khiến mọi Entity mới tạo ra đều có một ID khác `Guid.Empty` ngay lập tức.
3. **Hiểu lầm của EF Core**: Khi gọi `release.Tracks.Add(newTrack)`, EF Core thực hiện "Navigation Fixup". Nó kiểm tra ID của `newTrack`. 
   - Nếu `Id == Guid.Empty` (Sentinel Value): EF Core hiểu đây là Entity mới -> đặt State = `Added`.
   - Nếu `Id != Guid.Empty`: EF Core hiểu đây là Entity đã tồn tại (vì nó đã có ID) nhưng chưa được Track -> đặt State = `Modified`.
4. **Hệ quả**: Vì `newTrack` có ID từ constructor (`Guid.NewGuid()`), EF Core hiểu lầm nó là Entity cũ và cố gắng chạy lệnh `UPDATE` thay vì `INSERT`. Lệnh `UPDATE` thất bại vì ID đó chưa hề có trong Database.

### Tại sao Navigation Fixup thất bại nếu dùng Guid.NewGuid()?
Cơ chế **Navigation Fixup** của EF Core dựa vào việc so sánh giá trị Key hiện tại với giá trị mặc định (Sentinel Value). Nếu bạn gán `Guid.NewGuid()` trong constructor:
- `Guid.NewGuid() != Guid.Empty` -> EF Core không coi đây là entity mới.
- EF Core sẽ tự động chuyển trạng thái thành `Modified` để chuẩn bị cho lệnh `UPDATE`.

### Phân biệt DbSet.Add() và Navigation Collection Add()
- **`DbSet<T>.Add(entity)`**: Luôn ép trạng thái Entity thành `Added`, bất kể giá trị ID là gì (kể cả khi ID đã được gán trước). Nó "bỏ qua" cơ chế Sentinel Detection.
- **`Collection.Add(entity)`** (ví dụ `release.Tracks.Add(track)`): Phụ thuộc hoàn toàn vào Sentinel Value Detection để tự suy luận trạng thái. Đây là cách làm "đúng chuẩn" nhưng đòi hỏi ID phải là giá trị mặc định.

## Giải pháp (Solution)

### 1. Sửa BaseEntity (Ưu tiên)
Loại bỏ việc gán `Guid.NewGuid()` trong constructor. Hãy để PK mang giá trị mặc định (`Guid.Empty`) để EF Core nhận diện đúng là Entity mới.

```csharp
// ❌ SAI: Gây lỗi Sentinel Detection
public abstract class BaseEntity {
    public Guid Id { get; set; } = Guid.NewGuid(); 
}

// ✅ ĐÚNG: Để EF Core tự xử lý qua Guid.Empty
public abstract class BaseEntity {
    public Guid Id { get; set; } 
}
```

### 2. Sử dụng Repository.Add() trực tiếp
Nếu bắt buộc phải giữ ID khởi tạo trước, hãy sử dụng `Add()` từ Repository/DbSet thay vì add vào navigation collection để "force" trạng thái `Added`.

### 3. Bỏ Two-Phase Save
Không cần gọi `SaveChangesAsync` nhiều lần để lấy ID. EF Core đủ thông minh để sắp xếp thứ tự lệnh (DELETE các track cũ trước, INSERT các track mới sau) và tự gán Foreign Key chính xác trong một unit of work duy nhất.

## Bài học rút ra
- Đừng bao giờ gán giá trị khác "mặc định" cho Primary Key của Entity trừ khi bạn thực sự quản lý Key thủ công.
- Sử dụng `Guid.Empty` là "tín hiệu" an toàn nhất để báo cho EF Core biết đây là dữ liệu mới.
