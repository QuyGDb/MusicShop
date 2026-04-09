# Frontend Development Roadmap — Vinyl Shop (Next.js)

## Tech Stack tổng quan

| Layer | Technology | Lý do chọn |
|---|---|---|
| Framework | **Next.js 14 App Router** | SSR, ISR, layouts, nhanh setup |
| Language | **TypeScript** | Type-safe ↔ API contracts với .NET DTOs |
| Styling | **Tailwind CSS + shadcn/ui** | Không cần design system riêng |
| State (client) | **Zustand** | Nhẹ, đủ dùng cho cart/auth state |
| State (server) | **TanStack Query** | Cache, refetch, optimistic update |
| Forms | **React Hook Form + Zod** | Validation mirror FluentValidation BE |
| HTTP Client | **fetch native** | Thin wrapper, tự handle JWT header |
| Auth | **next/cookies + middleware + @react-oauth/google** | Auth đa phương thức (Local + Google) |
| SSE | **fetch + ReadableStream** | AI Chat streaming từ .NET SSE endpoint |
| Container | **Docker + Docker Compose** | Dev environment nhất quán với backend |

---

## Cấu trúc dự án

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx               ← layout tối giản
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (shop)/
│   │   │   ├── layout.tsx               ← navbar + footer
│   │   │   ├── page.tsx                 → /
│   │   │   ├── products/
│   │   │   │   ├── page.tsx             → /products
│   │   │   │   └── [slug]/page.tsx      → /products/abbey-road-vinyl
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   └── return/page.tsx      ← VNPAY callback
│   │   │   └── orders/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   │
│   │   └── (admin)/
│   │       ├── layout.tsx               ← sidebar riêng
│   │       ├── dashboard/page.tsx
│   │       ├── products/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       └── orders/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                          ← shadcn/ui (copy từ CLI)
│   │   └── features/
│   │       ├── ProductCard.tsx
│   │       ├── CartDrawer.tsx
│   │       ├── CheckoutForm.tsx
│   │       ├── OrderStatusBadge.tsx
│   │       └── AiChat.tsx               ← Tier 3
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                ← base fetch wrapper + auto refresh
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   ├── admin.ts
│   │   │   └── ai.ts                   ← SSE ReadableStream, Tier 3
│   │   ├── types.ts                     ← mirror .NET DTOs
│   │   └── utils.ts
│   │
│   ├── store/
│   │   ├── cartStore.ts                 ← Zustand, sessionStorage
│   │   └── authStore.ts                 ← Zustand, memory only
│   │
│   ├── hooks/
│   │   ├── useProducts.ts               ← TanStack Query
│   │   └── useOrders.ts
│   │
│   └── middleware.ts                    ← JWT guard + role check
│
├── Dockerfile
└── .env.local
```

**Nguyên tắc rendering:**
- Server Component mặc định — mọi page đều là Server Component trừ khi cần state/event
- Chỉ thêm `'use client'` cho: CartDrawer, FilterBar, Forms, AiChat
- Không viết CSS custom — 100% Tailwind utilities + shadcn/ui components

---

## Phase 8 — Setup & Auth *(song song Phase 1 backend)*

> **Mục tiêu:** Next.js chạy được, có layout chính, login/register hoạt động.
> **Bắt đầu khi:** Backend có `POST /auth/login`, `POST /auth/register`, `GET /auth/me`.

### 8.1 Project Setup

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
cd frontend
npx shadcn@latest init
npm install zustand @tanstack/react-query react-hook-form zod @hookform/resolvers @react-oauth/google
```

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
EXPOSE 3000
CMD ["node", "server.js"]
```

**Bổ sung vào `docker-compose.yml` của backend:**
```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:5000
    depends_on:
      - api
```

**Lưu ý backend — thêm CORS cho httpOnly cookie:**
```csharp
// Program.cs
builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", p =>
        p.WithOrigins(builder.Configuration["Cors:Origins"]!.Split(','))
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials())); // bắt buộc cho credentials: 'include'
```

---

### 8.2 Types — mirror .NET DTOs

Khai báo một lần, dùng toàn bộ codebase. Mỗi khi backend thêm DTO, cập nhật file này:

```ts
// lib/types.ts

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PagedResult<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: 'Customer' | 'Admin';
}

export interface ArtistDto {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  avatarUrl: string | null;
}

export interface GenreDto {
  id: string;
  name: string;
  slug: string;
}

export interface ProductDto {
  id: string;
  slug: string;
  name: string;
  format: 'Vinyl' | 'CD' | 'Cassette';
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  avgRating: number | null;
  coverUrl: string | null;
  artist: ArtistDto;
  genres: GenreDto[];
}

export interface OrderDto {
  id: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';
  totalAmount: number;
  createdAt: string;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  productVariantId: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  coverUrl: string | null;
}
```

---

### 8.3 API Client — base fetch wrapper

```ts
// lib/api/client.ts
import { useAuthStore } from '@/store/authStore';

export class ApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`API error ${status}`);
  }
}

let isRefreshing = false;

async function refreshToken(): Promise<string | null> {
  if (isRefreshing) return null;
  isRefreshing = true;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // gửi kèm httpOnly refresh token cookie
    });
    if (!res.ok) { useAuthStore.getState().clear(); return null; }
    const { data } = await res.json();
    useAuthStore.getState().setAuth(data.accessToken, data.user);
    return data.accessToken;
  } finally {
    isRefreshing = false;
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  retry = true
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    credentials: 'include',
  });

  // Auto refresh khi access token hết hạn
  if (res.status === 401 && retry) {
    const newToken = await refreshToken();
    if (newToken) return apiFetch(path, options, false);
  }

  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json();
}
```

---

### 8.4 Auth Store + Auth API

```ts
// store/authStore.ts
import { create } from 'zustand';
import { UserDto } from '@/lib/types';

interface AuthStore {
  accessToken: string | null;
  user: UserDto | null;
  setAuth: (token: string, user: UserDto) => void;
  clear: () => void;
}

// accessToken chỉ trong memory — không lưu localStorage (bảo mật)
export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clear: () => set({ accessToken: null, user: null }),
}));
```

```ts
// lib/api/auth.ts
import { apiFetch } from './client';
import { ApiResponse, UserDto } from '@/lib/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<ApiResponse<{ accessToken: string; user: UserDto }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<ApiResponse<UserDto>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  loginWithGoogle: (idToken: string) =>
    apiFetch<ApiResponse<{ accessToken: string; user: UserDto }>>('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  me: () => apiFetch<ApiResponse<UserDto>>('/auth/me'),

  logout: () =>
    apiFetch('/auth/logout', { method: 'POST' }),
};
```

---

### 8.5 Middleware — route guard

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/orders', '/checkout', '/admin'];
const ADMIN_ONLY = ['/admin'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const path  = req.nextUrl.pathname;

  const isProtected = PROTECTED.some(p => path.startsWith(p));
  if (isProtected && !token)
    return NextResponse.redirect(new URL('/login', req.url));

  // Admin guard — decode JWT để lấy role
  const isAdmin = ADMIN_ONLY.some(p => path.startsWith(p));
  if (isAdmin && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'Admin')
        return NextResponse.redirect(new URL('/', req.url));
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/orders/:path*', '/checkout/:path*', '/admin/:path*'],
};
```

---

### 8.6 Layout chính + Login / Register

**Root layout:**
```tsx
// app/(shop)/layout.tsx
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { CartDrawer } from '@/components/features/CartDrawer';
import Providers from '@/components/Providers';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </Providers>
  );
}
```

**Login page — React Hook Form + Zod:**
```tsx
// app/(auth)/login/page.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(s => s.setAuth);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const res = await authApi.login(data.email, data.password);
    setAuth(res.data.accessToken, res.data.user);
    router.push('/');
  }

  return (
    <div className="mx-auto max-w-sm py-20 px-4 text-center">
      <h1 className="text-2xl font-medium mb-8">Đăng nhập</h1>
      
      {/* Google Login Component */}
      <div className="mb-6 flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const res = await authApi.loginWithGoogle(credentialResponse.credential!);
            setAuth(res.data.accessToken, res.data.user);
            router.push('/');
          }}
          onError={() => console.log('Login Failed')}
        />
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Hoặc đăng nhập với email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input {...register('email')} type="email" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Mật khẩu</Label>
          <Input {...register('password')} type="password" />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </div>
  );
}
```

---

## Phase 9 — Product Listing & Detail *(song song Phase 2 backend)*

> **Mục tiêu:** Trang sản phẩm hoàn chỉnh với filter, search, ISR.
> **Bắt đầu khi:** Backend có `GET /products`, `GET /products/{slug}`, Redis cache, Meilisearch.

### 9.1 Products API

```ts
// lib/api/products.ts
import { apiFetch } from './client';
import { PagedResult, ProductDto } from '@/lib/types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  genre?: string;
  format?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}

export const productsApi = {
  list: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      )
    );
    return apiFetch<PagedResult<ProductDto>>(`/products?${params}`);
  },

  detail: (slug: string) =>
    apiFetch<{ success: boolean; data: ProductDto }>(`/products/${slug}`),

  search: (q: string) =>
    apiFetch<PagedResult<ProductDto>>(`/products/search?q=${encodeURIComponent(q)}`),
};
```

---

### 9.2 Product Listing — Server Component + ISR

```tsx
// app/(shop)/products/page.tsx
import { Suspense } from 'react';
import { productsApi } from '@/lib/api/products';
import { ProductCard } from '@/components/features/ProductCard';
import { FilterBar } from '@/components/features/FilterBar';
import { Pagination } from '@/components/features/Pagination';

export const revalidate = 3600; // ISR: revalidate mỗi 1 giờ

interface Props {
  searchParams: { genre?: string; format?: string; page?: string; q?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const filters = {
    page: Number(searchParams.page ?? 1),
    limit: 24,
    genre:  searchParams.genre,
    format: searchParams.format,
    q:      searchParams.q,
  };

  const { data: products, meta } = await productsApi.list(filters);

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        {/* FilterBar là Client Component — có state */}
        <Suspense>
          <FilterBar />
        </Suspense>

        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">{meta.total} sản phẩm</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={meta.page} total={meta.total} limit={meta.limit} />
        </div>
      </div>
    </div>
  );
}
```

---

### 9.3 Product Detail — generateStaticParams + ISR

```tsx
// app/(shop)/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { AddToCartButton } from '@/components/features/AddToCartButton';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await productsApi.list({ limit: 200 });
  return data.map(p => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const res = await productsApi.detail(params.slug).catch(() => null);
  if (!res?.success) notFound();

  const product = res.data;

  return (
    <div className="container py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={product.coverUrl ?? '/placeholder.png'}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{product.artist.name}</p>
          <h1 className="text-3xl font-medium">{product.name}</h1>
          <p className="text-2xl">
            {product.minPrice === product.maxPrice
              ? `${product.minPrice.toLocaleString('vi-VN')}đ`
              : `${product.minPrice.toLocaleString('vi-VN')}đ — ${product.maxPrice.toLocaleString('vi-VN')}đ`
            }
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.genres.map(g => (
              <span key={g.id} className="text-xs px-2 py-1 rounded-full bg-secondary">{g.name}</span>
            ))}
          </div>
          {/* AddToCartButton là Client Component */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 10 — Cart & Checkout *(song song Phase 3 backend)*

> **Mục tiêu:** Luồng mua hàng từ giỏ hàng đến tạo đơn.
> **Bắt đầu khi:** Backend có `POST /orders`, `GET /orders`, pessimistic lock.

### 10.1 Cart Store

```ts
// store/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  variantName: string;
  price: number;
  qty: number;
  coverUrl: string | null;
}

interface CartStore {
  items: CartItem[];
  add: (item: CartItem) => void;
  update: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set(s => {
        const exists = s.items.find(i => i.variantId === item.variantId);
        if (exists) return {
          items: s.items.map(i =>
            i.variantId === item.variantId ? { ...i, qty: i.qty + item.qty } : i
          ),
        };
        return { items: [...s.items, item] };
      }),
      update: (variantId, qty) => set(s => ({
        items: qty <= 0
          ? s.items.filter(i => i.variantId !== variantId)
          : s.items.map(i => i.variantId === variantId ? { ...i, qty } : i),
      })),
      remove: (variantId) => set(s => ({ items: s.items.filter(i => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'vinyl-cart',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
```

---

### 10.2 Cart Drawer — Client Component

```tsx
// components/features/CartDrawer.tsx
'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { items, update, remove, total, count } = useCartStore();
  const router = useRouter();

  // uiStore hoặc props để toggle open — tuỳ cách implement
  return (
    <Sheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Giỏ hàng ({count()} sản phẩm)</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-6 flex-1 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-10">Giỏ hàng trống</p>
          )}
          {items.map(item => (
            <div key={item.variantId} className="flex gap-3">
              <img src={item.coverUrl ?? '/placeholder.png'} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.variantName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="icon" className="h-6 w-6"
                    onClick={() => update(item.variantId, item.qty - 1)}>−</Button>
                  <span className="text-sm w-4 text-center">{item.qty}</span>
                  <Button variant="outline" size="icon" className="h-6 w-6"
                    onClick={() => update(item.variantId, item.qty + 1)}>+</Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">{(item.price * item.qty).toLocaleString('vi-VN')}đ</p>
                <Button variant="ghost" size="sm" className="text-destructive h-6 px-1 mt-1"
                  onClick={() => remove(item.variantId)}>Xoá</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-4 font-medium">
            <span>Tổng</span>
            <span>{total().toLocaleString('vi-VN')}đ</span>
          </div>
          <Button className="w-full" onClick={() => router.push('/checkout')}>
            Tiến hành thanh toán
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

### 10.3 Checkout Form

```tsx
// app/(shop)/checkout/page.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { apiFetch } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  recipientName:   z.string().min(2),
  phone:           z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  shippingAddress: z.string().min(10),
  paymentMethod:   z.enum(['VNPAY', 'COD']),
});
type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear, total } = useCartStore();
  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'VNPAY' },
  });

  async function onSubmit(data: FormData) {
    const res = await apiFetch<{ success: boolean; data: { orderId: string; paymentUrl?: string } }>(
      '/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          items: items.map(i => ({ productVariantId: i.variantId, quantity: i.qty })),
        }),
      }
    );

    clear();

    // VNPAY: redirect sang trang thanh toán
    if (res.data.paymentUrl) {
      window.location.href = res.data.paymentUrl;
      return;
    }

    // COD: đến trang order detail
    router.push(`/orders/${res.data.orderId}`);
  }

  return (
    <div className="container max-w-xl py-10">
      <h1 className="text-2xl font-medium mb-8">Thanh toán</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label>Họ tên người nhận</Label>
          <Input {...register('recipientName')} />
          {errors.recipientName && <p className="text-sm text-destructive">{errors.recipientName.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Số điện thoại</Label>
          <Input {...register('phone')} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Địa chỉ giao hàng</Label>
          <Input {...register('shippingAddress')} />
          {errors.shippingAddress && <p className="text-sm text-destructive">{errors.shippingAddress.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Phương thức thanh toán</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="VNPAY" {...register('paymentMethod')} />
              <span className="text-sm">VNPAY</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="COD" {...register('paymentMethod')} />
              <span className="text-sm">Tiền mặt (COD)</span>
            </label>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-4 font-medium">
            <span>Tổng tiền</span>
            <span>{total().toLocaleString('vi-VN')}đ</span>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || items.length === 0}>
            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

## Phase 11 — VNPAY Return & Order History *(song song Phase 4 backend)*

> **Bắt đầu khi:** Backend có VNPAY IPN, `GET /orders`, `GET /orders/{id}`.

### 11.1 VNPAY Return Page

```tsx
// app/(shop)/checkout/return/page.tsx
// Server Component — đọc query params từ VNPAY redirect
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  searchParams: {
    vnp_ResponseCode?: string;
    vnp_TxnRef?: string;
    vnp_Amount?: string;
  };
}

export default function CheckoutReturnPage({ searchParams }: Props) {
  const isSuccess = searchParams.vnp_ResponseCode === '00';
  const orderId   = searchParams.vnp_TxnRef;
  const amount    = searchParams.vnp_Amount
    ? (Number(searchParams.vnp_Amount) / 100).toLocaleString('vi-VN')
    : null;

  return (
    <div className="container max-w-md py-20 text-center">
      {isSuccess ? (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-medium mb-2">Thanh toán thành công</h1>
          {amount && <p className="text-muted-foreground mb-1">Số tiền: {amount}đ</p>}
          {orderId && <p className="text-muted-foreground mb-6 text-sm">Mã đơn: {orderId}</p>}
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href={`/orders/${orderId}`}>Xem đơn hàng</Link></Button>
            <Button variant="outline" asChild><Link href="/">Tiếp tục mua</Link></Button>
          </div>
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-medium mb-2">Thanh toán thất bại</h1>
          <p className="text-muted-foreground mb-6">Vui lòng thử lại hoặc chọn phương thức khác.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href="/cart">Quay lại giỏ hàng</Link></Button>
            <Button variant="outline" asChild><Link href="/">Về trang chủ</Link></Button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 11.2 Order History & Detail

```tsx
// app/(shop)/orders/page.tsx — Server Component
import { apiFetch } from '@/lib/api/client';
import { PagedResult, OrderDto } from '@/lib/types';
import { OrderStatusBadge } from '@/components/features/OrderStatusBadge';
import Link from 'next/link';

export default async function OrdersPage() {
  const { data: orders } = await apiFetch<PagedResult<OrderDto>>('/orders');

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-2xl font-medium mb-8">Đơn hàng của tôi</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} href={`/orders/${order.id}`}
            className="block border rounded-lg p-4 hover:bg-secondary transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="text-right space-y-1">
                <OrderStatusBadge status={order.status} />
                <p className="text-sm font-medium">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-muted-foreground py-20">Chưa có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}
```

**OrderStatusBadge — map trạng thái backend sang UI:**
```tsx
// components/features/OrderStatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { OrderDto } from '@/lib/types';

const STATUS_CONFIG: Record<OrderDto['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  Pending:   { label: 'Chờ xác nhận', variant: 'secondary' },
  Confirmed: { label: 'Đã xác nhận',  variant: 'default' },
  Shipped:   { label: 'Đang giao',    variant: 'default' },
  Delivered: { label: 'Đã giao',      variant: 'outline' },
  Completed: { label: 'Hoàn tất',     variant: 'outline' },
  Cancelled: { label: 'Đã huỷ',       variant: 'destructive' },
};

export function OrderStatusBadge({ status }: { status: OrderDto['status'] }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
```

---

## Phase 12 — Admin Dashboard *(song song Phase 5-6 backend)*

> **Bắt đầu khi:** Backend có Admin endpoints, Dapper reports.

### 12.1 Admin Layout

```tsx
// app/(admin)/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AdminSidebar } from '@/components/features/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Kiểm tra role phía server (double check thêm với middleware)
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) redirect('/login');

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
```

---

### 12.2 Admin Products — CRUD Table

```tsx
// app/(admin)/products/page.tsx — Server Component
import { productsApi } from '@/lib/api/products';
import { AdminProductsTable } from '@/components/features/AdminProductsTable';

export default async function AdminProductsPage({
  searchParams,
}: { searchParams: { page?: string } }) {
  const { data: products, meta } = await productsApi.list({
    page: Number(searchParams.page ?? 1),
    limit: 20,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Sản phẩm</h1>
        {/* CreateProductButton là Client Component (mở dialog) */}
      </div>
      {/* AdminProductsTable là Client Component — có delete, edit actions */}
      <AdminProductsTable products={products} meta={meta} />
    </div>
  );
}
```

---

### 12.3 Revenue Dashboard

```tsx
// app/(admin)/dashboard/page.tsx — Server Component
import { apiFetch } from '@/lib/api/client';
import { RevenueChart } from '@/components/features/RevenueChart';

export default async function DashboardPage() {
  const [revenueRes, ordersRes] = await Promise.all([
    apiFetch<{ data: RevenueByMonthDto[] }>('/admin/reports/revenue?months=6'),
    apiFetch<{ data: OrderStatsDto }>('/admin/reports/orders'),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Đơn hôm nay" value={ordersRes.data.todayCount} />
        <StatCard label="Đơn tháng này" value={ordersRes.data.monthCount} />
        <StatCard label="Doanh thu tháng" value={`${ordersRes.data.monthRevenue.toLocaleString('vi-VN')}đ`} />
        <StatCard label="Đơn chờ xử lý" value={ordersRes.data.pendingCount} />
      </div>

      {/* RevenueChart là Client Component — recharts */}
      <RevenueChart data={revenueRes.data} />
    </div>
  );
}
```

---

## Phase 13 — AI Chat *(song song Phase 7 backend — Tier 3)*

> **Bắt đầu khi:** Backend có `POST /conversations`, SSE streaming endpoint.

### 13.1 AI API — SSE ReadableStream

```ts
// lib/api/ai.ts
import { useAuthStore } from '@/store/authStore';

export const aiApi = {
  createConversation: () =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
      credentials: 'include',
    }).then(r => r.json()),
};

// Generator function — yield từng delta từ SSE stream
export async function* streamChat(conversationId: string, content: string) {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok || !res.body) throw new Error('Stream failed');

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer    = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.includes('[DONE]')) return;
      if (line.startsWith('data: ')) {
        const { delta } = JSON.parse(line.slice(6));
        if (delta) yield delta as string;
      }
    }
  }
}
```

---

### 13.2 AI Chat Component

```tsx
// components/features/AiChat.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { streamChat } from '@/lib/api/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

export function AiChat({ conversationId }: { conversationId: string }) {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [streaming, setStreaming]  = useState('');
  const [input, setInput]          = useState('');
  const [loading, setLoading]      = useState(false);
  const bottomRef                  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  async function send() {
    if (!input.trim() || loading) return;
    const content = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content }]);

    let full = '';
    try {
      for await (const delta of streamChat(conversationId, content)) {
        full += delta;
        setStreaming(full);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: full }]);
    } finally {
      setStreaming('');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              m.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm bg-secondary">
              {streaming}
              <span className="inline-block w-1 h-3 bg-current ml-0.5 animate-pulse" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Hỏi về vinyl, nhạc, hay bất cứ điều gì..."
          disabled={loading}
          className="flex-1"
        />
        <Button size="icon" onClick={send} disabled={loading || !input.trim()}>
          <SendHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

---

## Tổng hợp Roadmap Frontend

```
Phase 8 — Setup & Auth           ████░░░░░░░░░░░░░░░░░░  Tuần 1 (song song BE Phase 1)
  Next.js setup, types, API client, auth store, login/register, middleware

Phase 9 — Product Listing         ████████░░░░░░░░░░░░░░  Tuần 2 (song song BE Phase 2)
  Products ISR, filter bar, detail page, shadcn components

Phase 10 — Cart & Checkout        ████████████░░░░░░░░░░  Tuần 2-3 (song song BE Phase 3)
  Zustand cart store, cart drawer, checkout form

Phase 11 — VNPAY + Orders         ██████████████░░░░░░░░  Tuần 3 (song song BE Phase 4)
  Return page, order history, order detail, status badge

Phase 12 — Admin Dashboard        ████████████████░░░░░░  Tuần 4 (song song BE Phase 5-6)
  Admin layout, products CRUD, revenue chart

Phase 13 — AI Chat [Tier 3]       ████████████████████░░  Tuần 4 (song song BE Phase 7)
  SSE ReadableStream, chat component
```

---

## Checklist CV / Portfolio — Frontend

- **Next.js 14 App Router** — Server Components, ISR, `generateStaticParams`, Route Groups
- **TypeScript** — type-safe API client, types mirror .NET DTOs
- **Zustand** — cart store với sessionStorage persist, auth store in-memory
- **TanStack Query** — server state cache, invalidation, optimistic update
- **React Hook Form + Zod** — form validation mirror FluentValidation backend
- **shadcn/ui + Tailwind CSS** — component-driven UI, không CSS custom
- **Auth flow** — JWT + httpOnly cookie, auto refresh token, middleware route guard
- **VNPAY integration** — redirect flow, return page xử lý query params
- **SSE Streaming** — `fetch + ReadableStream` cho AI Chat *(nếu làm)*
- **Docker** — Dockerfile multi-stage cho Next.js, docker-compose với backend
