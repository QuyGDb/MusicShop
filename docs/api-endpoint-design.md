# API Endpoint Design — Vinyl Shop

## Quy ước chung

| Mục | Quy ước |
|---|---|
| Base URL | `/api/v1` |
| Auth header | `Authorization: Bearer <jwt_token>` |
| Content-Type | `application/json` |
| ID format | UUID v4 |
| Datetime | ISO 8601 — `2024-01-15T10:30:00Z` |
| Naming | **camelCase** cho JSON (request/response) |

### Phân quyền

| Role | Điều kiện |
|---|---|
| **Guest** | Không có JWT, hoặc JWT không hợp lệ |
| **Customer** | JWT hợp lệ + `role = customer` |
| **Admin** | JWT hợp lệ + `role = admin` |

### Cấu trúc response

**Thành công:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 120
  }
}
```

**Lỗi:**
```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Sản phẩm đã hết hàng"
  }
}
```

### Error codes thường gặp

| Code | HTTP | Ý nghĩa |
|---|---|---|
| `UNAUTHORIZED` | 401 | Chưa đăng nhập |
| `FORBIDDEN` | 403 | Không đủ quyền |
| `NOT_FOUND` | 404 | Resource không tồn tại |
| `VALIDATION_ERROR` | 422 | Dữ liệu đầu vào không hợp lệ |
| `OUT_OF_STOCK` | 409 | Hết hàng |
| `ORDER_NOT_CANCELLABLE` | 409 | Đơn hàng không thể hủy |
| `ALREADY_IN_WANTLIST` | 409 | Sản phẩm đã có trong wantlist |

---

## Mục 1 — Authentication

### `POST /api/v1/auth/register`

Đăng ký tài khoản mới. Mặc định role là `customer`.

**Auth:** Public

**Request body:**
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "plaintext_password"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "customer",
    "accessToken": "jwt_access_token_string",
    "refreshToken": "refresh_token_string",
    "accessTokenExpiresAt": "2024-01-15T10:15:00Z"
  }
}
```

### `POST /api/v1/auth/google-login`

Đăng nhập bằng tài khoản Google. Backend xác thực `idToken` và trả về JWT.

**Auth:** Public

**Request body:**
```json
{
  "idToken": "google_id_token_from_frontend"
}
```

**Response `200`:** Trả về đối tượng `AuthResponse` chứa JWT và thông tin user.

---

### `POST /api/v1/auth/login`

Đăng nhập bằng email/password.

**Auth:** Public

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "plaintext_password"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "customer",
    "accessToken": "jwt_access_token_string",
    "refreshToken": "refresh_token_string",
    "accessTokenExpiresAt": "2024-01-15T10:15:00Z"
  }
}
```

---

### `POST /api/v1/auth/refresh-token`

Lấy Access Token mới bằng Refresh Token hợp lệ.

**Auth:** Public

**Request body:**
```json
{
  "refreshToken": "current_refresh_token_string"
}
```

**Response `200`:** Trả về đối tượng `AuthResponse` mới (giống `/login`).

---

### `POST /api/v1/auth/logout`

Hủy (invalidate) Refresh Token hiện tại để đăng xuất hoàn toàn.

**Auth:** Customer, Admin

**Request body:**
```json
{
  "refreshToken": "refresh_token_to_revoke"
}
```

**Response `200`:**
```json
{ "success": true, "data": null }
```

---

### `GET /api/v1/auth/me`

Lấy thông tin user đang đăng nhập.

**Auth:** Customer, Admin

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "customer",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### `POST /api/v1/auth/forgot-password`

Gửi yêu cầu reset mật khẩu qua email.

**Auth:** Public

**Request body:**
```json
{ "email": "user@example.com" }
```

---

### `POST /api/v1/auth/reset-password`

Xác nhận đổi mật khẩu mới bằng token từ email.

**Auth:** Public (Token based)

**Request body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_secure_password"
}
```

---

### `POST /api/v1/auth/change-password`

Đổi mật khẩu khi đang đăng nhập.

**Auth:** Customer, Admin

**Request body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

## Mục 2 — Catalog

### `GET /api/v1/artists`

Danh sách nghệ sĩ, hỗ trợ filter và phân trang.

**Auth:** Public

**Query params:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `genre` | string | Slug của genre, ví dụ `progressive-rock` |
| `country` | string | Quốc gia, ví dụ `UK` |
| `q` | string | Tìm kiếm theo tên |
| `page` | int | Trang (default: 1) |
| `limit` | int | Số item/trang (default: 20, max: 100) |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Pink Floyd",
      "country": "UK",
      "imageUrl": "https://cdn.example.com/artists/pink-floyd.jpg",
      "genres": [
        { "id": "uuid", "name": "Progressive Rock", "slug": "progressive-rock" }
      ]
    }
  ],
  "meta": { "pageNumber": 1, "pageSize": 20, "maxPage": 5, "totalCount": 85 }
}
```

---

### `GET /api/v1/artists/:id`

Chi tiết nghệ sĩ, bao gồm danh sách releases.

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Pink Floyd",
    "bio": "...",
    "country": "UK",
    "imageUrl": "https://...",
    "genres": [...],
    "releases": [
      {
        "id": "uuid",
        "title": "The Dark Side of the Moon",
        "year": 1973,
        "coverUrl": "https://..."
      }
    ]
  }
}
```

---

### `POST /api/v1/artists`

Tạo nghệ sĩ mới.

**Auth:** Admin

**Request body:**
```json
{
  "name": "Miles Davis",
  "bio": "...",
  "country": "US",
  "imageUrl": "https://...",
  "genreIds": ["uuid1", "uuid2"]
}
```

**Response `201`:** Trả về object artist vừa tạo.

---

### `PUT /api/v1/artists/:id`

Cập nhật toàn bộ thông tin nghệ sĩ.

**Auth:** Admin

**Request body:** Tương tự `POST /artists`.

**Response `200`:** Trả về object artist đã cập nhật.

---

### `DELETE /api/v1/artists/:id`

Xóa nghệ sĩ. Chỉ xóa được khi không có release nào liên kết.

**Auth:** Admin

**Response `200`:**
```json
{ "success": true, "data": null }
```

---

### `GET /api/v1/genres`

Danh sách tất cả thể loại nhạc.

**Auth:** Public

---

### `GET /api/v1/genres/:id`

Chi tiết thể loại.

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Progressive Rock", "slug": "progressive-rock" }
}
```

---

### `POST /api/v1/genres`

Tạo genre mới.

**Auth:** Admin

**Request body:**
```json
{
  "name": "Jazz Fusion",
  "slug": "jazz-fusion"
}
```

**Response `201`:** Trả về đối tượng genre vừa tạo.

---

### `PUT /api/v1/genres/:id`

Cập nhật thông tin thể loại.

**Auth:** Admin

**Request body:**
```json
{
  "name": "Heavy Metal",
  "slug": "heavy-metal"
}
```

**Response `200`:** Trả về genre đã cập nhật.

---

### `DELETE /api/v1/genres/:id`

Xóa thể loại. Chỉ thực hiện khi không có Artist hoặc Release nào liên kết.

**Auth:** Admin

**Response `200`:**
```json
{ "success": true, "data": null }
```

---

### `GET /api/v1/releases`

Danh sách releases, hỗ trợ filter.

**Auth:** Public

**Query params:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `artist_id` | uuid | Lọc theo nghệ sĩ |
| `genre` | string | Slug của genre |
| `year` | int | Năm phát hành gốc |
| `q` | string | Tìm kiếm theo tên |
| `page` | int | Trang (default: 1) |
| `limit` | int | Số item/trang (default: 20) |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "The Dark Side of the Moon",
      "year": 1973,
      "coverUrl": "https://...",
      "artist": { "id": "uuid", "name": "Pink Floyd" },
      "genres": [...]
    }
  ],
  "meta": { "pageNumber": 1, "pageSize": 20, "maxPage": 12, "totalCount": 240 }
}
```

---

### `GET /api/v1/releases/:id`

Chi tiết release, bao gồm tracklist và danh sách phiên bản ép.

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "The Dark Side of the Moon",
    "year": 1973,
    "coverUrl": "https://...",
    "artist": { "id": "uuid", "name": "Pink Floyd" },
    "genres": [...],
    "tracks": [
      {
        "id": "uuid",
        "position": 1,
        "title": "Speak to Me",
        "durationSeconds": 68,
        "side": "A"
      }
    ],
    "versions": [
      {
        "id": "uuid",
        "pressingCountry": "UK",
        "pressingYear": 1973,
        "format": "vinyl",
        "catalogNumber": "SHVL 804",
        "label": { "id": "uuid", "name": "Harvest Records" },
        "notes": "First UK pressing"
      }
    ]
  }
}
```

---

### `POST /api/v1/releases`

Tạo release mới.

**Auth:** Admin

**Request body:**
```json
{
  "artistId": "uuid",
  "title": "Wish You Were Here",
  "year": 1975,
  "coverUrl": "https://...",
  "genreIds": ["uuid1"],
  "tracks": [
    {
      "position": 1,
      "title": "Shine On You Crazy Diamond (Parts I-V)",
      "durationSeconds": 817,
      "side": "A"
    }
  ]
}
```

**Response `201`:** Trả về object release vừa tạo (kèm tracks).

---

### `PUT /api/v1/releases/:id`

Cập nhật release.

**Auth:** Admin

---

---

### `GET /api/v1/release-versions/:id`

Chi tiết phiên bản ép (Pressing details).

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pressingCountry": "Japan",
    "pressingYear": 1976,
    "format": "vinyl",
    "catalogNumber": "EMS-80324",
    "label": { "id": "uuid", "name": "Toshiba EMI" },
    "notes": "OBI strip"
  }
}
```

---

### `POST /api/v1/release-versions`

Tạo phiên bản ép mới cho một release.

**Auth:** Admin

**Request body:**
```json
{
  "releaseId": "uuid",
  "labelId": "uuid",
  "pressingCountry": "Japan",
  "catalogNumber": "EMS-80324",
  "pressingYear": 1976,
  "format": "vinyl",
  "notes": "OBI strip, first Japan pressing"
}
```

**Response `201`:** Trả về object release_version vừa tạo.

---

### `PUT /api/v1/release-versions/:id`

Cập nhật phiên bản ép.

**Auth:** Admin

---

### `DELETE /api/v1/release-versions/:id`

Xóa phiên bản ép. Không xóa được nếu đã có `Product` liên kết.

**Auth:** Admin

**Response `200`:**
```json
{ "success": true, "data": null }
```

---

### `GET /api/v1/labels`

Danh sách hãng đĩa.

**Auth:** Public

**Query params:** `q` (tìm theo tên), `country`, `page`, `limit`

---

### `GET /api/v1/labels/:id`

Chi tiết hãng đĩa.

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Harvest Records",
    "country": "UK",
    "foundedYear": 1969,
    "website": "https://..."
  }
}
```

---

### `POST /api/v1/labels`

Tạo hãng đĩa mới.

**Auth:** Admin

**Request body:**
```json
{
  "name": "Harvest Records",
  "country": "UK",
  "foundedYear": 1969,
  "website": "https://..."
}
```

**Response `201`:** Trả về label vừa tạo.

---

### `PUT /api/v1/labels/:id`

Cập nhật hãng đĩa.

**Auth:** Admin

---

### `DELETE /api/v1/labels/:id`

Xóa hãng đĩa. Chỉ thực hiện khi không có release version nào liên kết.

**Auth:** Admin

**Response `200`:**
```json
{ "success": true, "data": null }
```

---

### `GET /api/v1/tracks`

Tìm kiếm bài hát toàn hệ thống.

**Auth:** Public

**Query params:** 

| Param | Kiểu | Mô tả |
|---|---|---|
| `q` | string | Tìm theo tên bài hát |
| `page` | int | Trang |
| `limit` | int | Số lượng |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "position": 1,
      "title": "Speak to Me",
      "durationSeconds": 68,
      "side": "A",
      "release": {
        "id": "uuid",
        "title": "The Dark Side of the Moon",
        "artist": { "id": "uuid", "name": "Pink Floyd" }
      }
    }
  ],
  "meta": { "pageNumber": 1, "pageSize": 20, "maxPage": 1, "totalCount": 1 }
}
```

---

## Mục 3 — Products

### `GET /api/v1/products`

Danh sách sản phẩm đang bán (`is_active = true`). Admin có thể xem cả sản phẩm ẩn.

**Auth:** Public

**Query params:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `format` | enum | `vinyl` / `cd` / `cassette` |
| `genre` | string | Slug của genre |
| `artist_id` | uuid | Lọc theo nghệ sĩ |
| `is_limited` | boolean | Chỉ hiển thị hàng limited |
| `is_preorder` | boolean | Chỉ hiển thị pre-order |
| `min_price` | decimal | Giá tối thiểu |
| `max_price` | decimal | Giá tối đa |
| `sort` | string | `price_asc`, `price_desc`, `newest`, `name_asc` |
| `q` | string | Tìm theo tên sản phẩm |
| `page` | int | Trang (default: 1) |
| `limit` | int | Số item/trang (default: 20) |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Pink Floyd — The Dark Side of the Moon",
      "format": "vinyl",
      "isLimited": false,
      "isPreorder": false,
      "isActive": true,
      "coverUrl": "https://...",
      "artist": { "id": "uuid", "name": "Pink Floyd" },
      "minPrice": 1200000,
      "maxPrice": 2500000,
      "inStock": true
    }
  ],
  "meta": { "pageNumber": 1, "pageSize": 20, "maxPage": 10, "totalCount": 180 }
}
```

> `min_price` và `max_price` được tính từ danh sách variants. `in_stock` = true khi ít nhất 1 variant có `stock_qty > 0`.

---

### `GET /api/v1/products/:id`

Chi tiết sản phẩm kèm tất cả variants và thông tin release.

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Pink Floyd — The Dark Side of the Moon (Japan OBI)",
    "description": "...",
    "format": "vinyl",
    "isLimited": true,
    "limitedQty": 50,
    "isPreorder": false,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "releaseVersion": {
      "id": "uuid",
      "pressingCountry": "Japan",
      "pressingYear": 1976,
      "catalogNumber": "EMS-80324",
      "notes": "OBI strip",
      "label": { "id": "uuid", "name": "Toshiba EMI" },
      "release": {
        "id": "uuid",
        "title": "The Dark Side of the Moon",
        "year": 1973,
        "coverUrl": "https://...",
        "artist": { "id": "uuid", "name": "Pink Floyd" },
        "genres": [...],
        "tracks": [...]
      }
    },
    "variants": [
      {
        "id": "uuid",
        "variantName": "Black 140g Standard",
        "price": 1200000,
        "stockQty": 5,
        "isAvailable": true,
        "isSigned": false,
        "vinylAttributes": {
          "discColor": "black",
          "weightGrams": "140",
          "speedRpm": "33",
          "discCount": "1lp",
          "sleeveType": "standard"
        }
      }
    ]
  }
}
```

---

### `POST /api/v1/products`

Tạo sản phẩm mới từ một release_version.

**Auth:** Admin

**Request body:**
```json
{
  "releaseVersionId": "uuid",
  "name": "Pink Floyd — The Dark Side of the Moon (Japan OBI)",
  "description": "...",
  "isLimited": true,
  "limitedQty": 50,
  "isPreorder": false
}
```

**Response `201`:** Trả về object product vừa tạo (chưa có variants).

---

### `PATCH /api/v1/products/:id`

Cập nhật thông tin product. Không cho phép tăng `limited_qty` nếu đã bắt đầu bán.

**Auth:** Admin

**Request body (tất cả optional):**
```json
{
  "name": "...",
  "description": "...",
  "isActive": false,
  "isPreorder": true,
  "preorderReleaseDate": "2024-06-01"
}
```

> **Nghiệp vụ:** `limited_qty` không được tăng sau khi product đã có ít nhất 1 order. Trả về lỗi `LIMITED_QTY_LOCKED` nếu vi phạm.

---

### `DELETE /api/v1/products/:id`

Ẩn sản phẩm (set `is_active = false`). Không xóa thật khỏi DB. Từ chối nếu còn đơn hàng Pending hoặc Confirmed.

**Auth:** Admin

**Response `200`:**
```json
{ "success": true, "data": null }
```

---

### `GET /api/v1/products/:id/variants`

Danh sách biến thể của sản phẩm kèm attributes.

**Auth:** Public

---

### `POST /api/v1/products/:id/variants`

Thêm biến thể mới cho sản phẩm. `attributes` tương ứng với `format` của product.

**Auth:** Admin

**Request body (Vinyl):**
```json
{
  "variantName": "Blue 180g Gatefold",
  "price": 1800000,
  "stockQty": 10,
  "isSigned": false,
  "imageUrl": "https://...",
  "attributes": {
    "discColor": "colored",
    "weightGrams": "180",
    "speedRpm": "33",
    "discCount": "1lp",
    "sleeveType": "gatefold"
  }
}
```

**Request body (CD):**
```json
{
  "variantName": "Japan Deluxe Edition",
  "price": 650000,
  "stockQty": 20,
  "isSigned": false,
  "attributes": {
    "edition": "deluxe",
    "isJapanEdition": true
  }
}
```

**Request body (Cassette):**
```json
{
  "variantName": "Clear Tape Limited",
  "price": 350000,
  "stockQty": 30,
  "isSigned": false,
  "attributes": {
    "tapeColor": "clear",
    "edition": "limited"
  }
}
```

**Response `201`:** Trả về object variant vừa tạo (kèm attributes).

---

### `PUT /api/v1/products/:id/variants/:variantId`

Cập nhật toàn bộ thông tin variant (giá, stock, attributes).

**Auth:** Admin

---

### `DELETE /api/v1/products/:id/variants/:variantId`

Xóa biến thể.

**Auth:** Admin

---



### `GET /api/v1/curated-collections`

Danh sách bộ sưu tập chủ đề. Guest và Customer chỉ thấy `is_published = true`. Admin thấy tất cả.

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Horror Soundtracks",
      "description": "...",
      "isPublished": true,
      "productCount": 12,
      "createdBy": { "id": "uuid", "name": "Admin User" }
    }
  ]
}
```

---

### `GET /api/v1/curated-collections/:id`

Chi tiết bộ sưu tập kèm danh sách sản phẩm (đã sắp xếp theo `sort_order`).

**Auth:** Public

---

### `POST /api/v1/curated-collections`

Tạo bộ sưu tập mới ở trạng thái draft (`is_published = false`).

**Auth:** Admin

**Request body:**
```json
{
  "title": "Vietnam New Wave",
  "description": "..."
}
```

---

### `PATCH /api/v1/curated-collections/:id`

Cập nhật và/hoặc publish bộ sưu tập.

**Auth:** Admin

**Request body:**
```json
{
  "title": "Vietnam New Wave (Updated)",
  "isPublished": true
}
```

---

### `POST /api/v1/curated-collections/:id/items`

Thêm sản phẩm vào bộ sưu tập.

**Auth:** Admin

**Request body:**
```json
{
  "productId": "uuid",
  "sortOrder": 3
}
```

---

### `DELETE /api/v1/curated-collections/:id/items/:productId`

Xóa sản phẩm khỏi bộ sưu tập.

**Auth:** Admin

---

## Mục 4 — Cart

Giỏ hàng được tạo tự động khi customer thêm item lần đầu (nếu chưa có cart). Tổng tiền luôn tính real-time từ variants, không lưu trong DB.

### `GET /api/v1/cart`

Lấy giỏ hàng hiện tại, tính tổng tiền real-time.

**Auth:** Customer

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updatedAt": "2024-01-15T10:00:00Z",
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "variant": {
          "id": "uuid",
          "variantName": "Black 140g Standard",
          "price": 1200000,
          "stockQty": 5,
          "isAvailable": true,
          "product": {
            "id": "uuid",
            "name": "Pink Floyd — The Dark Side of the Moon",
            "coverUrl": "https://..."
          }
        },
        "subtotal": 2400000
      }
    ],
    "total": 2400000
  }
}
```

---

### `POST /api/v1/cart/items`

Thêm variant vào giỏ. Nếu variant đã có trong giỏ thì cộng thêm số lượng.

**Auth:** Customer

**Request body:**
```json
{
  "productVariantId": "uuid",
  "quantity": 1
}
```

**Response `201`:** Trả về cart item vừa thêm.

---

### `PATCH /api/v1/cart/items/:itemId`

Cập nhật số lượng. Nếu `quantity = 0` thì xóa item.

**Auth:** Customer

**Request body:**
```json
{
  "quantity": 3
}
```

---

### `DELETE /api/v1/cart/items/:itemId`

Xóa 1 item khỏi giỏ hàng.

**Auth:** Customer

---

### `DELETE /api/v1/cart`

Xóa toàn bộ giỏ hàng.

**Auth:** Customer

---

## Mục 5 — Orders

### `POST /api/v1/orders`

Tạo đơn hàng từ giỏ hàng hiện tại. Thực hiện trong 1 database transaction.

**Auth:** Customer

**Request body:**
```json
{
  "shippingAddress": "123 Nguyen Hue, Q1, TP.HCM",
  "recipientName": "Nguyen Van A",
  "phone": "0901234567",
  "paymentMethod": "vnpay"
}
```

**Nghiệp vụ bên trong (service layer):**

1. Kiểm tra `stock_qty` đủ cho từng variant
2. Nếu `is_preorder = true`, bỏ qua việc trừ stock cho đến `preorder_release_date`
3. Snapshot giá vào `order_items.unit_price`
4. Snapshot thông tin giao hàng vào `orders`
5. Tính `total_amount` từ `order_items`
6. Trừ `stock_qty` (nếu không phải preorder)
7. Xóa các items trong giỏ hàng
8. Tạo `payments` record với `status = pending`
9. Trigger gửi email `order_created`

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "status": "pending",
      "totalAmount": 2400000,
      "createdAt": "2024-01-15T10:00:00Z"
    },
    "payment": {
      "id": "uuid",
      "method": "vnpay",
      "status": "pending",
      "vnpayUrl": "https://sandbox.vnpayment.vn/..."
    }
  }
}
```

---

### `GET /api/v1/orders`

Lịch sử đơn hàng của user hiện tại.

**Auth:** Customer

**Query params:** `status`, `page`, `limit`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "completed",
      "totalAmount": 2400000,
      "createdAt": "2024-01-15T10:00:00Z",
      "itemCount": 2
    }
  ],
  "meta": { "pageNumber": 1, "pageSize": 20, "maxPage": 1, "totalCount": 5 }
}
```

---

### `GET /api/v1/orders/:id`

Chi tiết đơn hàng kèm order items và thông tin thanh toán.

**Auth:** Customer (chỉ xem đơn của mình), Admin (xem tất cả)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "shipped",
    "shippingAddress": "123 Nguyen Hue, Q1, TP.HCM",
    "recipientName": "Nguyen Van A",
    "phone": "0901234567",
    "totalAmount": 2400000,
    "trackingNumber": "VN123456789",
    "createdAt": "2024-01-15T10:00:00Z",
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "unitPrice": 1200000,
        "subtotal": 2400000,
        "variant": {
          "id": "uuid",
          "variantName": "Black 140g Standard",
          "product": {
            "id": "uuid",
            "name": "Pink Floyd — The Dark Side of the Moon",
            "coverUrl": "https://..."
          }
        }
      }
    ],
    "payment": {
      "method": "vnpay",
      "status": "success",
      "paidAt": "2024-01-15T10:05:00Z"
    }
  }
}
```

---

### `POST /api/v1/orders/:id/cancel`

Hủy đơn hàng. Customer chỉ được hủy khi status là `pending`. Admin được hủy từ `confirmed` trở đi.

**Auth:** Customer, Admin

**Request body:**
```json
{
  "cancelReason": "Đặt nhầm sản phẩm"
}
```

**Nghiệp vụ bên trong:** Hoàn lại `stock_qty` nếu đã trừ trước đó.

**Response `200`:** Trả về order đã cập nhật.

---

### `GET /api/v1/admin/orders`

Admin xem toàn bộ đơn hàng trong hệ thống.

**Auth:** Admin

**Query params:** `status`, `user_id`, `date_from`, `date_to`, `page`, `limit`

---

### `PATCH /api/v1/admin/orders/:id/status`

Admin chuyển trạng thái đơn hàng theo luồng: `pending → confirmed → shipped → delivered → completed`.

**Auth:** Admin

**Request body:**
```json
{
  "status": "shipped",
  "trackingNumber": "VN123456789"
}
```

> `tracking_number` bắt buộc khi chuyển sang `shipped`.


---

## Mục 6 — Payment

### `POST /api/v1/payments/vnpay/create`

Tạo link thanh toán VNPay cho đơn hàng đang ở trạng thái `pending payment`.

**Auth:** Customer

**Request body:**
```json
{
  "orderId": "uuid",
  "returnUrl": "https://vinylshop.vn/checkout/result"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
  }
}
```

---

### `GET /api/v1/payments/vnpay/callback`

VNPay redirect người dùng về URL này sau khi thanh toán. Verify chữ ký HMAC-SHA512, cập nhật `payments.status`.

**Auth:** Public (không cần JWT, verify bằng VNPay signature)

**Query params:** Tham số do VNPay truyền về (vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash, ...)

**Response:** Redirect sang frontend với `?status=success` hoặc `?status=failed`.

---

### `POST /api/v1/payments/vnpay/ipn`

VNPay IPN — server-to-server notification. Verify signature và cập nhật trạng thái thanh toán.

**Auth:** Public (verify bằng VNPay signature)

**Response `200`:**
```json
{ "RspCode": "00", "Message": "Confirm Success" }
```

---

### `GET /api/v1/orders/:id/payment`

Trạng thái thanh toán của đơn hàng.

**Auth:** Customer

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "method": "vnpay",
    "amount": 2400000,
    "status": "success",
    "transactionCode": "VNP123456",
    "paidAt": "2024-01-15T10:05:00Z"
  }
}
```

---

## Mục 7 — Wantlist & Collection

### `GET /api/v1/wantlist`

Danh sách sản phẩm muốn mua của user.

**Auth:** Customer

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "addedAt": "2024-01-10T08:00:00Z",
      "product": {
        "id": "uuid",
        "name": "Miles Davis — Kind of Blue",
        "coverUrl": "https://...",
        "inStock": false
      }
    }
  ]
}
```

---

### `POST /api/v1/wantlist`

Thêm sản phẩm vào wantlist. Trả về lỗi `ALREADY_IN_WANTLIST` nếu đã có.

**Auth:** Customer

**Request body:**
```json
{
  "productId": "uuid"
}
```

---

### `DELETE /api/v1/wantlist/:productId`

Xóa sản phẩm khỏi wantlist.

**Auth:** Customer

---

### `GET /api/v1/collection`

Bộ sưu tập cá nhân của user (những đĩa user đang sở hữu).

**Auth:** Customer

**Response `200`:** Cấu trúc tương tự `GET /wantlist`.

---

### `POST /api/v1/collection`

Thêm sản phẩm vào collection. User có thể thêm dù không mua tại shop.

**Auth:** Customer

**Request body:**
```json
{
  "productId": "uuid"
}
```

---

### `DELETE /api/v1/collection/:productId`

Xóa sản phẩm khỏi collection.

**Auth:** Customer

---

## Mục 8 — Notifications

### `GET /api/v1/notifications`

Lịch sử thông báo của user hiện tại.

**Auth:** Customer

**Query params:** `type`, `status`, `page`, `limit`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "order_shipped",
      "channel": "email",
      "status": "sent",
      "sentAt": "2024-01-15T10:05:00Z",
      "referenceId": "order_uuid"
    }
  ]
}
```

---

### `GET /api/v1/admin/notifications`

Admin xem toàn bộ notification log trong hệ thống.

**Auth:** Admin

**Query params:** `status`, `type`, `userId`, `dateFrom`, `dateTo`, `page`, `limit`

---

### `POST /api/v1/admin/notifications/:id/retry`

Admin retry gửi lại email thất bại (`status = failed`).

**Auth:** Admin

**Response `200`:** Trả về notification log đã cập nhật.

---

## Mục 9 — [FUTURE] AI Features

### `POST /api/v1/ai/conversations`

Tạo phiên hội thoại mới. Guest sẽ nhận `session_token` để định danh. Customer gắn với `user_id`.

**Auth:** Public

**Request body (Guest):**
```json
{
  "session_token": null
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sessionToken": "abc123xyz",
    "expiresAt": "2024-01-15T10:30:00Z",
    "startedAt": "2024-01-15T10:00:00Z"
  }
}
```

> Với Customer: `expiresAt = null` (lưu vĩnh viễn). Với Guest: `expiresAt = startedAt + 30 phút`.

---

### `GET /api/v1/ai/conversations`

Lịch sử các phiên hội thoại của user.

**Auth:** Customer

**Query params:** `page`, `limit`

---

### `GET /api/v1/ai/conversations/:id/messages`

Danh sách tin nhắn trong hội thoại.

**Auth:** Customer (chỉ xem conversation của mình), Guest (cần truyền `session_token`)

**Query params:** `page`, `limit`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "role": "user", "content": "Gợi ý cho tôi vài album jazz", "created_at": "..." },
    { "id": "uuid", "role": "assistant", "content": "Tôi recommend...", "created_at": "..." }
  ]
}
```

---

### `POST /api/v1/ai/conversations/:id/messages`

Gửi tin nhắn và nhận phản hồi AI. Khuyến nghị dùng **Server-Sent Events (SSE)** để stream response.

**Auth:** Public (Guest cần truyền `session_token` trong header hoặc body)

**Request body:**
```json
{
  "content": "Gợi ý cho tôi album jazz phù hợp để nghe buổi tối",
  "sessionToken": "abc123xyz"
}
```

**Response streaming `200` (SSE):**
```
data: {"delta": "Tôi "}
data: {"delta": "recommend "}
data: {"delta": "Kind of Blue..."}
data: [DONE]
```

**Nghiệp vụ bên trong:** Mỗi khi có tin nhắn mới, cập nhật `ai_conversations.last_active_at`.

---

### `DELETE /api/v1/ai/conversations/:id`

Xóa phiên hội thoại và tất cả tin nhắn liên quan.

**Auth:** Customer

---

### `GET /api/v1/recommendations`

Lấy danh sách gợi ý cá nhân hóa (đã cache, làm mới mỗi 24 giờ).

**Auth:** Customer

**Điều kiện:** User phải có ít nhất 1 đơn hàng completed hoặc 3 sản phẩm trong wantlist. Trả về `[]` nếu chưa đủ điều kiện.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "score": 0.92,
      "variant": {
        "id": "uuid",
        "variantName": "Black 180g Gatefold",
        "price": 1800000,
        "product": {
          "id": "uuid",
          "name": "Radiohead — OK Computer",
          "coverUrl": "https://..."
        }
      }
    }
  ],
  "meta": { "generatedAt": "2024-01-15T00:00:00Z", "expiresAt": "2024-01-16T00:00:00Z" }
}
```

---

## Tổng hợp endpoints

| # | Method | Endpoint | Auth |
|---|---|---|---|
| 1 | POST | `/auth/register` | Public |
| 2 | POST | `/auth/login` | Public |
| 3 | POST | `/auth/refresh-token` | Public |
| 4 | POST | `/auth/logout` | Customer |
| 5 | GET | `/auth/me` | Customer |
| 6 | POST | `/auth/forgot-password` | Public |
| 7 | POST | `/auth/reset-password` | Public |
| 8 | POST | `/auth/change-password` | Customer |
| 9 | GET | `/artists` | Public |
| 10 | GET | `/artists/:id` | Public |
| 11 | POST | `/artists` | Admin |
| 12 | PUT | `/artists/:id` | Admin |
| 13 | DELETE | `/artists/:id` | Admin |
| 14 | GET | `/genres` | Public |
| 15 | GET | `/genres/:id` | Public |
| 16 | POST | `/genres` | Admin |
| 17 | PUT | `/genres/:id` | Admin |
| 18 | DELETE | `/genres/:id` | Admin |
| 19 | GET | `/releases` | Public |
| 20 | GET | `/releases/:id` | Public |
| 21 | POST | `/releases` | Admin |
| 22 | PUT | `/releases/:id` | Admin |
| 23 | GET | `/release-versions/:id` | Public |
| 24 | POST | `/release-versions` | Admin |
| 25 | PUT | `/release-versions/:id` | Admin |
| 26 | DELETE | `/release-versions/:id` | Admin |
| 27 | GET | `/labels` | Public |
| 28 | GET | `/labels/:id` | Public |
| 29 | POST | `/labels` | Admin |
| 30 | PUT | `/labels/:id` | Admin |
| 31 | DELETE | `/labels/:id` | Admin |
| 32 | GET | `/tracks` | Public |
| 33 | GET | `/products` | Public |
| 34 | GET | `/products/:id` | Public |
| 35 | POST | `/products` | Admin |
| 36 | PATCH | `/products/:id` | Admin |
| 37 | DELETE | `/products/:id` | Admin |
| 38 | GET | `/products/:id/variants` | Public |
| 39 | POST | `/products/:id/variants` | Admin |
| 40 | PUT | `/products/:id/variants/:variantId` | Admin |
| 41 | DELETE | `/products/:id/variants/:variantId` | Admin |

| 43 | GET | `/curated-collections` | Public |
| 44 | GET | `/curated-collections/:id` | Public |
| 45 | POST | `/curated-collections` | Admin |
| 46 | PATCH | `/curated-collections/:id` | Admin |
| 47 | POST | `/curated-collections/:id/items` | Admin |
| 48 | DELETE | `/curated-collections/:id/items/:productId` | Admin |
| 49 | GET | `/cart` | Customer |
| 50 | POST | `/cart/items` | Customer |
| 51 | PATCH | `/cart/items/:itemId` | Customer |
| 52 | DELETE | `/cart/items/:itemId` | Customer |
| 53 | DELETE | `/cart` | Customer |
| 54 | POST | `/orders` | Customer |
| 55 | GET | `/orders` | Customer |
| 56 | GET | `/orders/:id` | Customer |
| 57 | POST | `/orders/:id/cancel` | Customer |
| 58 | GET | `/admin/orders` | Admin |
| 59 | PATCH | `/admin/orders/:id/status` | Admin |
| 60 | POST | `/admin/orders/:id/cancel` | Admin |

| 62 | POST | `/payments/vnpay/create` | Customer |
| 63 | GET | `/payments/vnpay/callback` | Public |
| 64 | POST | `/payments/vnpay/ipn` | Public |
| 65 | GET | `/orders/:id/payment` | Customer |
| 66 | GET | `/wantlist` | Customer |
| 67 | POST | `/wantlist` | Customer |
| 68 | DELETE | `/wantlist/:productId` | Customer |
| 69 | GET | `/collection` | Customer |
| 70 | POST | `/collection` | Customer |
| 71 | DELETE | `/collection/:productId` | Customer |
| 72 | GET | `/notifications` | Customer |
| 73 | GET | `/admin/notifications` | Admin |
| 74 | POST | `/admin/notifications/:id/retry` | Admin |
| 75 | POST | `/ai/conversations` | [FUTURE] |
| 76 | GET | `/ai/conversations` | [FUTURE] |
| 77 | GET | `/ai/conversations/:id/messages` | [FUTURE] |
| 78 | POST | `/ai/conversations/:id/messages` | [FUTURE] |
| 79 | DELETE | `/ai/conversations/:id` | [FUTURE] |
| 80 | GET | `/recommendations` | [FUTURE] |

**Tổng: 80 endpoints**
