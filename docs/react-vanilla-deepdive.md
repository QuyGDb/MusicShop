# MusicShop: React Vanilla - Deep Dive Guide

Tài liệu này giải thích chi tiết về cấu trúc, tư duy và các kỹ thuật được sử dụng trong dự án MusicShop phiên bản **React Vanilla**. 

---

## 1. Triết lý "React Vanilla"
Thay vì sử dụng các framework nặng nề (như Next.js) hay các thư viện quản lý trạng thái phức tạp (như Redux/Zustand), dự án này tập trung vào **Core React APIs**.
*   **Mục tiêu**: Hiểu bản chất của Data Flow (Dòng chảy dữ liệu) và Component Lifecycle (Vòng đời linh kiện).
*   **Nguyên tắc**: Nếu React đã có sẵn tính năng đó (useState, useContext), chúng ta sẽ không cài thêm thư viện ngoài.

---

## 2. Cấu trúc thư mục (Folder Structure)
Dự án được tổ chức theo mô hình **Flat SPA (Single Page Application)**, giúp việc tìm kiếm code trở nên trực quan:

*   **`src/pages/`**: Chứa các màn hình lớn của ứng dụng (Home, Login, Products). Đây là điểm đến của các Route.
*   **`src/components/`**: 
    *   **`ui/`**: Các linh kiện nguyên tử (Atomic components) như Button, Input... sử dụng shadcn/ui.
    *   **`auth/`**: Các linh kiện phức hợp phục vụ riêng cho tính năng Auth (LoginForm, RegisterForm).
*   **`src/services/`**: Lớp giao tiếp với Backend. Chứa logic fetch dữ liệu, xử lý lỗi và format dữ liệu trước khi đưa vào Component.
*   **`src/context/`**: Quản lý trạng thái toàn cục (Global State) mà không cần đến Redux.
*   **`src/hooks/`**: Chứa các Logic tái sử dụng (Custom Hooks), ví dụ: `useAuth`.

---

## 3. Luồng hoạt động của Provider & Context
Dự án sử dụng mô hình **Provider Pattern** để cung cấp dữ liệu xuyên suốt ứng dụng.

### Sơ đồ bao bọc (Wrapping):
```text
React.StrictMode (Kiểm lỗi)
 └── GoogleOAuthProvider (Cấp quyền Google Login)
      └── AuthProvider (Quản lý trạng thái đăng nhập)
           └── BrowserRouter (Hệ thống điều hướng URL)
                └── App (Toàn bộ nội dung ứng dụng)
```

### Cách thức hoạt động:
1.  **AuthProvider** tạo ra một "môi trường" chứa thông tin User và Token.
2.  Dữ liệu này được phát đi thông qua `AuthContext.Provider`.
3.  Bất kỳ Component nào nằm trong `App` cũng có thể "nghe" được tín hiệu này thông qua Hook `useAuth()`.
4.  **Lợi ích**: Tránh được hiện tượng **Prop Drilling** (phải truyền dữ liệu qua quá nhiều cấp trung gian).

---

## 4. Lớp giao tiếp API (Networking)
Chúng ta đã chuyển từ Axios sang **Native Fetch API** để giảm phụ thuộc vào thư viện ngoài.

### `apiClient.ts` Wrapper:
Chúng ta tạo một hàm wrapper để tái sử dụng các tính năng cao cấp của fetch:
*   **Base URL**: Tự động thêm tiền tố API vào mọi link.
*   **Auto-Token**: Tự động đọc `accessToken` từ `localStorage` và gắn vào Header `Authorization`.
*   **JSON Handling**: Tự động chuyển đổi dữ liệu gửi đi thành JSON và giải mã dữ liệu nhận về.

---

## 5. Kiến trúc Styling (Tailwind CSS v4)
Dự án sử dụng Tailwind v4 với cách tiếp cận mới:

*   **`@theme`**: Thay thế cho file config JS cũ. Mọi cấu hình màu sắc, font chữ (như font **Geist**) đều khai báo trực tiếp trong thẻ này tại file `index.css`.
*   **CSS Variables**: Sử dụng biến CSS chuẩn (`--color-background`) để kết nối giữa cấu hình Tailwind và các Component UI.
*   **Utility-First**: Thay vì viết hàng trăm dòng CSS, chúng ta kết hợp các class nhỏ (`flex`, `p-4`, `bg-black`) ngay trong file HTML/JSX để đạt tốc độ phát triển cao nhất.

---

## 6. Luồng đi của một Action (Ví dụ: Login)
1.  **UI**: Người dùng nhập liệu vào `LoginForm` (trạng thái lưu trong `useState`).
2.  **Interaction**: Người dùng nhấn nút, gọi hàm `authService.login()`.
3.  **Service**: `authService` dùng `apiClient` để `fetch` dữ liệu từ Backend (.NET).
4.  **Update Global State**: Nếu thành công, Page gọi `setAuth()` từ `useAuth()`.
5.  **Re-render**: `AuthContext` thay đổi dữ liệu -> Toàn bộ App (như Navbar) tự động cập nhật trạng thái đã đăng nhập.

---
*Tài liệu này được biên soạn để hỗ trợ quá trình nghiên cứu và phát triển dự án MusicShop.*
