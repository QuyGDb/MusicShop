# API Implementation Audit — MusicShop

## Trạng thái hiện tại: 80 endpoints trong spec

Audit dựa trên code thực tế trong `MusicShop.Api/Controllers/`.

> [!NOTE]
> ✅ = Đã implement | ❌ = Chưa có | ⚠️ = Có nhưng khác spec

---

## Mục 1 — Authentication (8 endpoints)

| # | Endpoint | Spec | Code | Ghi chú |
|---|---|---|---|---|
| 1 | `POST /auth/register` | ✅ | ✅ | |
| 2 | `POST /auth/login` | ✅ | ✅ | |
| — | `POST /auth/google-login` | ✅ | ✅ | Có trong code, không đánh số trong bảng tổng hợp |
| 3 | `POST /auth/refresh-token` | ✅ | ✅ | Route trong code là `refresh`, spec là `refresh-token` |
| 4 | `POST /auth/logout` | ✅ | ✅ | |
| 5 | `GET /auth/me` | ✅ | ✅ | |
| 6 | `POST /auth/forgot-password` | ✅ | ❌ | **Chưa implement** |
| 7 | `POST /auth/reset-password` | ✅ | ❌ | **Chưa implement** |
| 8 | `POST /auth/change-password` | ✅ | ✅ | |

**Auth: 6/8 done** — Thiếu forgot-password + reset-password.

---

## Mục 2 — Catalog (24 endpoints)

### Artists
 
| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 9 | `GET /artists` | ✅ | |
| 10 | `GET /artists/:id` | ✅ | Route dùng `{slug}` cho SEO |
| 11 | `POST /artists` | ✅ | |
| 12 | `PUT /artists/:id` | ✅ | Route dùng `{id:guid}` |
| 13 | `DELETE /artists/:id` | ✅ | Route dùng `{id:guid}` |

### Genres
 
| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 14 | `GET /genres` | ✅ | |
| 15 | `GET /genres/:id` | ✅ | Route dùng `{slug}` |
| 16 | `POST /genres` | ✅ | |
| 17 | `PUT /genres/:id` | ✅ | Đã implement `{id:guid}` |
| 18 | `DELETE /genres/:id` | ✅ | Đã implement `{id:guid}` |

### Releases
 
| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 19 | `GET /releases` | ✅ | |
| 20 | `GET /releases/:id` | ✅ | Route dùng `{slug}` |
| 21 | `POST /releases` | ✅ | |
| 22 | `PUT /releases/:id` | ✅ | Route dùng `{id:guid}` |

### Release Versions

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 23 | `GET /release-versions/:id` | ⚠️ | Route là `by-release/{releaseId}` — lấy theo release, không phải theo version id |
| 24 | `POST /release-versions` | ✅ | |
| 25 | `PUT /release-versions/:id` | ✅ | |
| 26 | `DELETE /release-versions/:id` | ✅ | |

### Labels
 
| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 27 | `GET /labels` | ✅ | |
| 28 | `GET /labels/:id` | ✅ | Route dùng `{slug}` |
| 29 | `POST /labels` | ✅ | |
| 30 | `PUT /labels/:id` | ✅ | Route dùng `{id:guid}` |
| 31 | `DELETE /labels/:id` | ✅ | Route dùng `{id:guid}` |

### Tracks

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 32 | `GET /tracks` | ❌ | **Không có TracksController** |

**Catalog: 22/24 done** — Thiếu: `GET /tracks`, `GET /release-versions/:id` (public detail by ID).

---

## Mục 3 — Products (9 endpoints)

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 33 | `GET /products` | ✅ | |
| 34 | `GET /products/:id` | ✅ | Route dùng `{slug}` |
| 35 | `POST /products` | ✅ | |
| 36 | `PATCH /products/:id` | ✅ | Route dùng `{id:guid}` |
| 37 | `DELETE /products/:id` | ✅ | Route dùng `{id:guid}` |
| 38 | `GET /products/:id/variants` | ✅ | Route `{slug}/variants` |
| 39 | `POST /products/:id/variants` | ✅ | |
| 40 | `PUT /products/:id/variants/:variantId` | ✅ | |
| 41 | `DELETE /products/:id/variants/:variantId` | ✅ | |

**Products: 9/9 done**

---

## Mục 3.5 — Curated Collections (6 endpoints)

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 43 | `GET /curated-collections` | ✅ | |
| 44 | `GET /curated-collections/:id` | ✅ | |
| 45 | `POST /curated-collections` | ✅ | |
| 46 | `PATCH /curated-collections/:id` | ✅ | |
| 47 | `POST /curated-collections/:id/items` | ✅ | |
| 48 | `DELETE /curated-collections/:id/items/:productId` | ✅ | |

**Curated Collections: 6/6 done**

---

## Mục 4 — Cart (5 endpoints)

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 49 | `GET /cart` | ✅ | |
| 50 | `POST /cart/items` | ✅ | |
| 51 | `PATCH /cart/items/:itemId` | ⚠️ | Code dùng `PUT` thay vì `PATCH` |
| 52 | `DELETE /cart/items/:itemId` | ✅ | |
| 53 | `DELETE /cart` | ❌ | **Clear cart chưa có** |

**Cart: 4/5 done** — Thiếu: DELETE /cart (clear all).

---

## Mục 5 — Orders (8 endpoints)

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 54 | `POST /orders` | ✅ | Checkout logic — xử lý stock, cart và order |
| 55 | `GET /orders` | ✅ | Lịch sử đơn hàng |
| 56 | `GET /orders/:id` | ✅ | Chi tiết đơn hàng |
| 57 | `POST /orders/:id/cancel` | ✅ | Hủy đơn hàng |
| 58 | `GET /admin/orders` | ✅ | Danh sách đơn hàng cho Admin |
| 59 | `PATCH /admin/orders/:id/status` | ✅ | Cập nhật trạng thái đơn (Admin) |
| 60 | `POST /admin/orders/:id/cancel` | ✅ | Hủy đơn bởi Admin |

**Orders: 7/7 done**

---

## Mục 6 — Payment (4 endpoints)

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 62 | `POST /payments/stripe/create-session` | ✅ | |
| 64 | `POST /payments/stripe/webhook` | ✅ | Source of truth cho trạng thái đơn hàng |
| 65 | `GET /orders/:id/payment` | ❌ | |

**Payment: 2/3 done** — Stripe Checkout + Webhook đã sẵn sàng.

---

## Mục 7 — Wantlist & Collection (6 endpoints)

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 66–71 | Wantlist & Collection | ❌ | **Không có controller nào** |

**Wantlist & Collection: 0/6 done**

---

## Mục 8 — Notifications (3 endpoints)

| # | Endpoint | Code | Ghi chú |
|---|---|---|---|
| 72–74 | Notifications | ❌ | **Chưa implement** |

**Notifications: 0/3 done**

---

## Mục 9 — [FUTURE] AI (6 endpoints)

Đã đánh dấu FUTURE, bỏ qua.

---

## Tổng kết

| Module | Done | Total | % |
|---|---|---|---|
| Auth | 6 | 8 | 75% |
| Catalog | 22 | 24 | 92% |
| Products | 9 | 9 | 100% |
| Curated Collections | 6 | 6 | 100% |
| Cart | 4 | 5 | 80% |
| Orders | 7 | 7 | 100% |
| Payment | 2 | 3 | 66% |
| Wantlist & Collection | 0 | 6 | 0% |
| Notifications | 0 | 3 | 0% |
| **Tổng (trừ FUTURE)** | **48** | **71** | **67%** |

---

## Cần implement để đạt ~80% (59/74 endpoints)

> [!IMPORTANT]
> Đây là danh sách **19 endpoints** cần thêm, xếp theo **mức độ ưu tiên**.

### Priority 1 — Orders & Payment (luồng mua hàng end-to-end)

Không có Orders + Payment thì Cart vô nghĩa.

| # | Endpoint | Lý do |
|---|---|---|
| 54 | `POST /orders` | Checkout — cốt lõi |
| 55 | `GET /orders` | Lịch sử đơn hàng |
| 56 | `GET /orders/:id` | Chi tiết đơn |
| 57 | `POST /orders/:id/cancel` | Hủy đơn — quyền cơ bản của customer |
| 59 | `PATCH /admin/orders/:id/status` | Admin chuyển trạng thái (confirmed → shipped → delivered) |
| 62 | `POST /payments/stripe/create-session` | Tạo link thanh toán (Stripe Checkout) |
| 63 | `GET /payments/stripe/success` | Stripe redirect thành công |
| 64 | `POST /payments/stripe/webhook` | Stripe server notification — CỰC KỲ QUAN TRỌNG |
| 65 | `GET /orders/:id/payment` | Xem trạng thái thanh toán |

### Priority 2 — Thiếu sót nhỏ trong module đã có

| # | Endpoint | Lý do |
|---|---|---|
| 53 | `DELETE /cart` | Clear cart — UX cơ bản |
| 17 | `PUT /genres/:id` | Admin sửa genre — module Catalog gần hoàn thiện mà thiếu cái này |
| 58 | `GET /admin/orders` | Admin dashboard |


### Có thể bỏ qua ở 80%

- `forgot-password`, `reset-password` (#6, #7) — cần email service, chưa cấp bách
- Wantlist & Collection (#66–71) — tính năng nâng cao
- Notifications (#72–74) — cần email infrastructure
- `GET /tracks` (#32) — search track riêng, ít ai cần
- `GET /release-versions/:id` (#23) — đã có list by release

