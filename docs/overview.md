# MusicShop — Complete Project Documentation

---

## 1. Project Overview

> AI-powered Music Shop · ASP.NET Core 10 · Claude API · pgvector  

### 1.1 Overview
MusicShop is an online platform for selling physical media (vinyl, CD, cassette). The Admin is the sole manager of the catalog.

The key differentiator from standard shops is the integration of an **AI Agent** that helps customers find products, answers music-related questions, and provides personalized recommendations based on interests.


---

# MusicShop — Tài liệu Nghiệp vụ

---

## Mục lục

0. [Tổng quan tính năng](#0-tổng-quan-tính-năng)
1. [Vai trò người dùng](#1-vai-trò-người-dùng)
2. [Catalog âm nhạc](#2-catalog-âm-nhạc)
3. [Sản phẩm & Bán hàng](#3-sản-phẩm--bán-hàng)
4. [Quy trình đơn hàng](#4-quy-trình-đơn-hàng)
5. [Thanh toán](#5-thanh-toán)
6. [Tính năng AI](#6-tính-năng-ai)
7. [Thông báo & Sự kiện nghiệp vụ](#7-thông-báo--sự-kiện-nghiệp-vụ)

## 0. Tổng quan tính năng

### 0.1 Xác thực & Tài khoản
* Đăng ký tài khoản (Local)
* Đăng nhập / đăng xuất (Local + Google Auth)
* Phân quyền theo vai trò (Guest / Customer / Admin)

### 0.2 Catalog & Sản phẩm
* Xem sản phẩm: general, random
* Lọc sản phẩm (thể loại nhạc, định dạng (cd, cassette, vinyl), nghệ sĩ, quốc gia, giá, thập niên)
* Tìm kiếm sản phẩm (tên album, single, ep, tên bài hát, thể loại nhạc, định dạng (cd, cassette, vinyl), nghệ sĩ, quốc gia)
* Xem chi tiết sản phẩm (thông tin nghệ sĩ, phiên bản, tracklist)
* Xem sản phẩm theo bộ sưu tập chủ đề (Curated Collections)
* Quản lý catalog (Admin: thêm / sửa / xóa nghệ sĩ, products)

### 0.3 Mua hàng
* Thêm sản phẩm vào giỏ hàng
* Đặt hàng
* Chọn phương thức thanh toán (VNPAY / COD)
* Đặt hàng trước (Pre-order)
* Theo dõi trạng thái đơn hàng
* Hủy đơn hàng (Customer: chỉ khi Pending / Admin: từ Confirmed trở đi)
* Đánh giá sản phẩm sau khi đơn hoàn thành

### 0.4 Thanh toán
* Thanh toán online qua cổng VNPAY
* Thanh toán COD (tiền mặt khi nhận hàng)
* Ghi nhận lịch sử giao dịch

### 0.5 Quản lý đơn hàng (Admin)
* Xác nhận đơn hàng
* Cập nhật trạng thái ship
* Hủy đơn hàng
* Xem báo cáo doanh thu

### 0.6 Wantlist & Collection
* Thêm / xóa sản phẩm khỏi Wantlist
* Thêm / xóa sản phẩm khỏi Collection
* Nhận thông báo khi sản phẩm trong Wantlist có hàng trở lại

### 0.7 AI
* Chat với trợ lý AI để tìm kiếm và khám phá sản phẩm (Guest + Customer)
* Lưu lịch sử hội thoại AI (Customer)
* Nhận gợi ý sản phẩm cá nhân hóa (Customer)

### 0.8 Thông báo
* Gửi email xác nhận khi đơn được tạo
* Gửi email khi đơn được xác nhận
* Gửi email kèm thông tin vận chuyển khi đơn được ship
* Gửi email mời đánh giá khi đơn hoàn thành
* Gửi email thông báo khi đơn bị hủy

---

## 1. Vai trò người dùng

| Vai trò | Mô tả | Quyền hạn |
|---|---|---|
| **Guest** | Khách vãng lai, chưa đăng nhập | Xem danh mục, tìm kiếm & lọc sản phẩm, chat AI (lưu tạm 30 phút) |
| **Customer** | Khách hàng đã đăng ký (Email hoặc Google) | Mua hàng, theo dõi đơn, Wantlist, Collection, nhận gợi ý AI cá nhân hóa, chat AI lưu lịch sử lâu dài |
| **Admin** | Chủ shop | Quản lý catalog, xác nhận / ship / hủy đơn, xem báo cáo doanh thu, xem log hành động |

---

## 2. Catalog âm nhạc

Kho dữ liệu âm nhạc — tách biệt hoàn toàn khỏi logic mua bán. Đây là nền tảng để AI hoạt động và để quản lý thông tin sản phẩm chính xác.

### 2.1 Phân cấp dữ liệu

```
Nghệ sĩ  ──→  Bản phát hành gốc  ──→  Phiên bản cụ thể  ──→  Tracklist
```

| Thực thể | Thông tin lưu trữ | Ví dụ |
|---|---|---|
| **Nghệ sĩ** | Tên, tiểu sử, thể loại, quốc gia | Pink Floyd, Miles Davis |
| **Bản phát hành gốc** | Tên album, năm phát hành, thể loại, ảnh bìa | "Dark Side of the Moon" (1973) |
| **Phiên bản cụ thể** | Lần ép, quốc gia, định dạng, số catalog, hãng đĩa | US first press, Japan obi 1976, 2011 Remaster |
| **Tracklist** | Vị trí, tên bài, thời lượng | Side A — Track 1: Speak to Me |

### 2.2 Lý do phân tách Bản gốc và Phiên bản

Một album gốc có thể có hàng chục phiên bản khác nhau, mỗi phiên bản có giá, tình trạng và tồn kho riêng biệt. Phân cấp này giúp quản lý chính xác từng bản in mà không trùng lặp thông tin nghệ thuật.

### 2.3 Hãng đĩa (Label)

Lưu trữ thông tin hãng đĩa liên kết với từng phiên bản cụ thể: tên hãng, quốc gia, năm thành lập, website.

---

## 3. Sản phẩm & Bán hàng

### 3.1 Loại sản phẩm

- Vinyl
- CD
- Cassette

### 3.2 Biến thể sản phẩm

Mỗi sản phẩm có thể có nhiều biến thể. Mỗi biến thể có giá và tồn kho độc lập.

**Vinyl**

| Nhóm | Ví dụ |
|---|---|
| Màu đĩa | Black, Colored, Splatter, Picture disc |
| Trọng lượng | 140g (standard), 180g (audiophile) |
| Tốc độ | 33⅓ RPM, 45 RPM |
| Số đĩa | 1LP, 2LP, Box set |
| Phiên bản bìa | Standard sleeve, Gatefold, Obi strip |
| Chữ ký | Signed by artist |

**CD**

| Nhóm | Ví dụ |
|---|---|
| Nội dung | Standard, Deluxe / Expanded (bonus tracks), Box set |
| Phiên bản quốc gia | Japan edition (thường có bonus track riêng) |
| Chữ ký | Signed by artist |

**Cassette**

| Nhóm | Ví dụ |
|---|---|
| Màu băng | Black, Clear, White, Colored |
| Phiên bản | Standard, Limited edition |
| Chữ ký | Signed by artist |

### 3.3 Tính năng đặc biệt

**Limited Edition**
- Số lượng giới hạn được xác định từ trước.
- Không được phép tăng số lượng giới hạn sau khi bắt đầu bán.

**Pre-order**
- Khách hàng đặt trước trước ngày phát hành.
- Tồn kho không bị trừ cho đến khi đến ngày phát hành thực tế.

### 3.4 Quy tắc tồn kho

- Hết hàng → tự động đánh dấu không thể mua, ẩn khỏi danh sách có hàng.
- Không được xóa sản phẩm khi đang có đơn hàng ở trạng thái Pending hoặc Confirmed.
- Khi hàng về kho → hệ thống tự động thông báo cho các khách hàng có sản phẩm đó trong Wantlist.

### 3.5 Bộ sưu tập sản phẩm (Curated Collections)

Admin có thể tạo các bộ sưu tập theo chủ đề biên tập.

Ví dụ: *Horror Soundtracks*, *Video Game OST*, *Vietnam New Wave*.

---

## 4. Quy trình đơn hàng

### 4.1 Vòng đời đơn hàng

```
Pending → Confirmed → Shipped → Delivered → Completed
             ↓
          Cancelled (chỉ Admin từ trạng thái này trở đi)
```

| Trạng thái | Mô tả |
|---|---|
| **Pending** | Khách vừa đặt hàng, chờ xác nhận |
| **Confirmed** | Admin đã xác nhận đơn |
| **Shipped** | Đơn đã được gửi đi |
| **Delivered** | Đơn đã đến tay khách |
| **Completed** | Hoàn tất, khách có thể để lại đánh giá |
| **Cancelled** | Đơn bị hủy |

### 4.2 Quy tắc nghiệp vụ

- **Checkout:** trừ tồn kho ngay khi đặt hàng thành công.
- **Hủy ở trạng thái Pending:** hoàn toàn bộ tồn kho về như cũ.
- **Hủy từ Confirmed trở lên:** chỉ Admin mới có quyền thực hiện.
- **Mỗi đơn chỉ có đúng 1 lần thanh toán.**

### 4.3 Đánh giá sản phẩm

Khách hàng có thể để lại đánh giá (rating 1–5 sao + nhận xét) sau khi đơn hàng hoàn thành.

---

## 5. Thanh toán

### 5.1 Phương thức thanh toán

| Phương thức | Mô tả |
|---|---|
| **VNPAY** | Thanh toán online qua cổng VNPAY |
| **COD** | Thanh toán tiền mặt khi nhận hàng |

### 5.2 Thông tin ghi nhận

Mỗi lần thanh toán lưu: số tiền, phương thức thanh toán, mã giao dịch, thời điểm thanh toán, trạng thái.

---

## 6. Tính năng AI

### 6.1 Chat Agent

Trợ lý trò chuyện giúp khách hàng tìm kiếm và khám phá sản phẩm.

**Phạm vi hoạt động:**
- Chỉ trả lời các câu hỏi trong phạm vi âm nhạc và sản phẩm của shop.
- Tự động trích dẫn sản phẩm liên quan kèm link khi phù hợp.
- Không hỗ trợ đặt hàng qua chat.

**Lịch sử hội thoại:**
- Guest: lịch sử lưu tạm, mất sau 30 phút không hoạt động.
- Customer: lịch sử được lưu lâu dài vào tài khoản.

**Ví dụ hội thoại:**

```
Khách:  "Có đĩa nhạc phim kinh dị nào không?"
Agent:  "Hiện shop có một số soundtrack kinh dị hay:
         • Halloween 40th Anniversary — John Carpenter (850k)
           Bản limited blue vinyl, remastered 2018
         • Hellraiser OST — Mondo exclusive 140g (1.2M)
           Còn 2 bản cuối
         Bạn thích phong cách nào — ambient horror hay orchestral score?"

Khách:  "Vinyl 140g khác 180g thế nào?"
Agent:  "140g là standard chất lượng tốt, 180g là audiophile grade —
         nặng hơn, ít rung động hơn khi play, thường dùng cho limited pressing..."
```

### 6.2 Gợi ý cá nhân hóa

Hệ thống gợi ý sản phẩm phù hợp dựa trên thói quen và sở thích của từng khách hàng.

**Điều kiện kích hoạt:**
- Khách hàng cần có ít nhất 1 đơn hàng hoàn thành **hoặc** 3 sản phẩm trong Wantlist.

**Quy tắc lọc:**
- Không gợi ý sản phẩm đã có trong Collection của khách hàng.
- Không gợi ý sản phẩm đang hết hàng.

**Tần suất cập nhật:**
- Làm mới mỗi 24 giờ.
- Làm mới ngay khi khách hàng có hoạt động mới (mua hàng, thêm wantlist…).

---

## 7. Thông báo & Sự kiện nghiệp vụ

### 7.1 Thông báo theo vòng đời đơn hàng

| Sự kiện | Hành động thông báo |
|---|---|
| Đơn được tạo | Gửi email xác nhận đơn hàng cho khách |
| Đơn được xác nhận | Gửi email cập nhật trạng thái |
| Đơn đã ship | Gửi email kèm thông tin vận chuyển |
| Đơn hoàn thành | Gửi email mời khách đánh giá sản phẩm |
| Đơn bị hủy | Gửi email thông báo hủy đơn |

### 7.2 Thông báo Wantlist

- Khi sản phẩm trong Wantlist có hàng trở lại → thông báo ngay cho khách hàng.
- Sau khi đã thông báo → không thông báo lại cho cùng sản phẩm đó trong vòng **7 ngày**.

---

*Tài liệu này chỉ mô tả nghiệp vụ. Các quyết định về công nghệ (framework, database, message queue, v.v.) được ghi nhận trong tài liệu kỹ thuật riêng biệt.*
