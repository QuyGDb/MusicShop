# Google Authentication: OIDC vs OAuth 2.0 Flow

Tài liệu này tổng hợp các kiến thức quan trọng về hệ thống xác thực Google trong dự án MusicShop, giúp phân biệt rõ giữa việc "Đăng nhập" (Identity) và "Cấp quyền" (Authorization).

## 1. So sánh OIDC và OAuth 2.0

Hệ thống MusicShop hiện tại đang sử dụng **OpenID Connect (OIDC)** làm lớp định danh chính.

| Đặc điểm | OpenID Connect (OIDC) | OAuth 2.0 |
| :--- | :--- | :--- |
| **Mục đích** | **Xác thực (Authentication)**: Trả lời câu hỏi "Bạn là ai?" | **Ủy quyền (Authorization)**: Trả lời câu hỏi "Bạn được phép làm gì?" |
| **Loại Token** | **ID Token** (Dạng JWT) | **Access Token** (Thường là chuỗi Opaque ngẫu nhiên) |
| **Dữ liệu trả về** | Thông tin nhân thân: `email`, `name`, `sub` (ID). | Quyền hạn truy cập: `read:drive`, `write:youtube`. |
| **Cơ chế xác thực** | Dựa trên **Chữ ký số** (Mã hóa bất đối xứng). | Dựa trên **Mã xác thực & ClientSecret** (Nếu dùng Backend). |
| **Ví dụ sử dụng** | Đăng nhập vào App bằng Google. | Cho phép App đăng video lên YouTube hộ bạn. |

---

## 2. Phân biệt ClientID và ClientSecret

Việc hiểu đúng hai loại mã này giúp bảo mật hệ thống tốt hơn:

*   **ClientID (Số CCCD của App):** 
    *   Là mã công khai dùng để định danh ứng dụng của bạn trên Google.
    *   **Tại sao Login chỉ cần ClientID?** Vì Backend của bạn chỉ đóng vai trò là "Người kiểm tra". Bạn dùng **Public Key** của Google để soi chữ ký trên ID Token. Việc này không cần mật khẩu bí mật nào cả. 
*   **ClientSecret (Mật khẩu của App):** 
    *   Sử dụng khi Server-to-Server cần chứng minh danh tính với Google (ví dụ: đổi mã code lấy Access Token).
    *   **Bảo mật:** Tuyệt đối không để lộ ở Frontend. Chỉ dùng khi bạn thực hiện các luồng OAuth 2.0 phức tạp (Drive/Youtube API).

---

## 3. Luồng Token trong MusicShop

Hệ thống của chúng ta thực hiện 3 chặng luân chuyển Token để đảm bảo tính độc lập:

1.  **Chặng 1 (Google -> Frontend):** Google trả về **ID Token** (Giấy chứng nhận từ Google).
2.  **Chặng 2 (Frontend -> Backend):** Frontend gửi **ID Token** lên để Backend "kiểm tra thật giả".
3.  **Chặng 3 (Backend -> Frontend):** Backend xác nhận xong sẽ thu lại ID Token và phát hành một cái **MusicShop AccessToken** riêng (Vé nội bộ của dự án).

> [!TIP]
> **Tại sao không dùng luôn ID Token của Google cho mọi request?**
> Vì chúng ta muốn Backend của mình có toàn quyền kiểm soát phiên đăng nhập (Session), có thể tự động thu hồi quyền truy cập hoặc đổi quyền (Role) của User mà không phụ thuộc vào Google.

---

## 4. Cấu hình bảo mật (`appsettings.json`)

Chúng ta chỉ lưu `ClientId` vì hiện tại chỉ sử dụng luồng Xác định danh tính (OIDC):

```json
"GoogleSettings": {
  "ClientId": "697848035915-q6vbaqu6n9510tf3tfhmt0kpk24ou7r6.apps.googleusercontent.com"
}
```

## 5. Lưu ý về Database (ExternalId)

Khi lưu User, chúng ta sử dụng trường `Subject` (từ `payload.Subject`) làm **ExternalId**.
*   **Lý do:** Email có thể thay đổi, nhưng `Subject` là định danh **vĩnh viễn và duy nhất** mà Google cấp cho người dùng đó. Điều này giúp User không bị mất tài khoản khi đổi email.

---
> [!IMPORTANT]
> Tài liệu này được biên soạn dựa trên quá trình tích hợp thực tế. Hãy luôn cập nhật khi có thêm tính năng OAuth 2.0 (như tích hợp Drive/Youtube).
