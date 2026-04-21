# Frontend Development Roadmap — Music Shop (Vite + React)

## Định hướng phát triển
- **Mục tiêu:** Xây dựng ứng dụng E-commerce chuyên nghiệp, hiệu năng cao, dễ bảo trì.
- **Quy tắc:** Sử dụng các thư viện hàng đầu trong hệ sinh thái React hiện đại (TanStack, Zustand, Axios) để tối ưu hóa năng suất và trải nghiệm người dùng.

## Tech Stack hiện tại

| Layer | Technology | Lý do chọn |
|---|---|---|
| Framework | **React 19** | Phiên bản mới nhất với các cải tiến về performance và hooks (`use`). |
| Build tool | **Vite 6** | Tốc độ bundle và HMR cực nhanh. |
| Language | **TypeScript 5** | Đảm bảo Type-safety toàn diện từ API đến UI. |
| Routing | **React Router 7** | Giải pháp routing tiêu chuẩn, hỗ trợ nested routes và layout tốt. |
| Styling | **Tailwind CSS 4** | Styling dựa trên các utility classes, tối ưu CSS bundle. |
| UI Components | **shadcn/ui + Base UI** | Hệ thống component accessible, dễ tùy chỉnh style. |
| State (Global) | **Zustand 5** | Quản lý state nhẹ, không cần boilerplate như Redux. |
| Server State | **TanStack Query 5** | Caching, synchronization, và quản lý loading/error state chuyên nghiệp. |
| Forms | **TanStack Form** | Type-safe form management, tích hợp sâu với Zod. |
| Validation | **Zod** | Schema validation mạnh mẽ, đồng bộ với backend. |
| HTTP Client | **Axios** | Hỗ trợ Interceptors mạnh mẽ cho auto-refresh token. |
| Auth | **Google OAuth** | Đăng nhập nhanh chóng, bảo mật. |

---

## Cấu trúc dự án (Feature-based Architecture)

```
musicshop-web/
├── src/
│   ├── app/                    ← Cấu hình gốc (App.tsx, router, styles)
│   ├── features/               ← Các module chức năng (Domain-driven)
│   │   ├── auth/               ← components, hooks, services, types của Auth
│   │   ├── catalog/            ← Artists, Genres
│   │   ├── products/           ← Danh sách, chi tiết sản phẩm
│   │   └── orders/             ← Giỏ hàng, thanh toán, đơn hàng
│   ├── layouts/                ← ShopLayout, AdminLayout
│   ├── pages/                  ← Route-level components (giữ logic mỏng)
│   ├── lib/                    ← Third-party config (axios, queryClient)
│   ├── store/                  ← Zustand global stores
│   ├── shared/                 ← Reusable UI, hooks, utils
│   └── types/                  ← Global TS interfaces
├── public/
├── index.html
├── vite.config.ts
└── tailwind.config.js (or postcss config)
```

---
---

## Roadmap Phát Triển Frontend (Ưu Tiên Admin Page Trước)

Dự án hiện tại sẽ tập trung vào việc hoàn thiện hệ thống Quản trị (Admin) để có thể nạp dữ liệu Catalog và mở bán Sản phẩm trước khi hoàn thiện giao diện cho Khách hàng.

### Phase 1: Admin Layout & Authorization
> **Mục tiêu:** Thiết lập khung giao diện quản trị và bảo mật chặt chẽ.
- **Admin Routing:** Cấu hình nested routes `/admin/*`.
- **Protected Routes:** Tạo component `AdminRouteGuard` kiểm tra JWT Role = `Admin`. Redirect về `/login` hoặc `/403` nếu không đủ quyền hạn.
- **Layout & Navigation:** Hoàn thiện `AdminLayout` với Sidebar chứa các mục: Dashboard, Catalog, Inventory, Orders, Curation.

### Phase 2: Catalog Management (Data Core)
> **Mục tiêu:** Quản trị các thực thể gốc của ngành công nghiệp âm nhạc. Bậc dữ liệu này là bắt buộc phải có trước khi tạo một Bản phát hành (Release).
- **Thực thể Cơ bản (Base Entities):** 
  - Khởi tạo giao diện Quản lý Danh sách và Thêm/Sửa: Nghệ sĩ (Artist), Thể loại (Genre), Hãng đĩa (Label).
  - Sử dụng TanStack Table để hiển thị dữ liệu phân trang.
- **Release (Bản phát hành gốc):**  liên kết với các Thực thể Cơ bản ở trên.
  - Tạo mới thông tin gốc (Tên album, năm góc, chọn Nghệ sĩ, chọn Thể loại, chọn Hãng đĩa, liner notes).
  - **Trình chỉnh sửa Tracklist:** UI cho phép thêm các bài hát, thời lượng, và chọn Side A/B (đối với Vinyl).
- **Release Version (Phiên bản):** 
  - Khai báo các phiên bản cụ thể kế thừa từ Release gốc (Ví dụ: Bản ép Nhật 1976, Bản Remaster 2011).

### Phase 3: Product Inventory & Dynamic Variant Editor (Quan trọng nhất)
> **Mục tiêu:** Biến một phiên bản Release thành một "Sản phẩm" bày bán trên kệ với giá và tồn kho thực tế.
- **Quản lý danh sách Sản Phẩm:** Hiển thị kho hàng, lọc theo trạng thái (`is_active`, `is_limited`, `is_preorder`).
- **Workflow Tạo Sản Phẩm (2 Bước):**
  - **Bước 1: Tạo Product (Sản phẩm gốc):**
    - Admin chọn 1 `ReleaseVersion` đã có sẵn trong Catalog.
    - Khai báo thông tin bán hàng chung: Định dạng (`Format`), `is_limited`, `is_preorder`.
  - **Bước 2: Quản lý Product Variants (Biến thể):**
    - Từ Product gốc, thêm các Biến thể (Variants).
    - **Dynamic Fields theo Định Dạng (Format) của Product:**
      - Nếu là **Vinyl**: Hiện dropdown chọn màu đĩa (`black`, `colored`), trọng lượng (`140g`, `180g`), tốc độ (`33rpm`), Sleeve Type (`gatefold`, `obi-strip`).
      - Nếu là **CD**: Hiện tickbox `Japan Edition`, loại hộp cứng.
      - Nếu là **Cassette**: Chọn màu băng.
    - Quản lý Giá (`Unit Price`) và Số lượng tồn kho (`Stock Qty`) tương ứng cho từng biến thể.

### Phase 4: Order Fulfillment (Xử lý Đơn Hàng)
> **Mục tiêu:**  Quy trình theo dõi và cập nhật trạng thái đơn hàng mua từ khách hàng.
- **Order Board:** Bảng lưới động (TanStack Table) xem danh sách Đơn hàng với các bộ lọc theo `Trạng thái` và `Ngày đặt`.
- **Order Action Modals:**
  - **Nút Xác Nhận (Confirm):** Đánh dấu đã nhận đơn.
  - **Nút Giao Hàng (Ship):** Yêu cầu Admin nhập bắt buộc mã vận chuyển (`tracking_number`) trước khi chuyển status sang Shipped.
  - **Nút Huỷ Đơn (Cancel):** Hỗ trợ Admin quyền can thiệp đặc biệt huỷ đơn ở bất kỳ cấp độ nào trước khi Completed. Yêu cầu nhập `cancel_reason`.
- **Order Details:** Hiển thị các `Snapshot` (Giữ nguyên giá, địa chỉ giao hàng tại lúc checkout để không bị ảnh hưởng nếu sản phẩm đổi giá).

### Phase 5: Marketing & Curation
> **Mục tiêu:** Quản trị nội dung hiển thị trên trang chủ để hướng sự chú ý của khách hàng.
- **Trình quản lý Collection (Bộ sưu tập):** Tạo các bộ sưu tập chủ đề ("Vietnam New Wave", "Staff Picks").
- **Product Picker:** Modal hiển thị thanh search (Live query bằng hook `useProducts`) để chọn Sản Phẩm nạp vào Bộ Sưu Tập. 
- **Sắp xếp tuỳ chỉnh (Custom Sort):** Cung cấp công cụ Drag & Drop hoặc textbox nhập số `sort_order` để quyết định sản phẩm nào hiện ra đầu tiên.
