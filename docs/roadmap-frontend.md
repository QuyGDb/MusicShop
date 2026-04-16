# Frontend Development Roadmap — Vinyl Shop (Vite + React)

## Định hướng học tập (React Deep-Dive)
- **Mục tiêu:** Trở về bản ngã của React. Tự tay làm mọi thứ để rèn luyện tư duy luồng dữ liệu (Data flow) và vòng đời (Lifecycle) trước khi lạm dụng thư viện.
- **Quy tắc:** Từ chối các "ma thuật" làm sẵn. Không Zustand, không TanStack Query, không React Hook Form. Tự xây dựng State Management Global bằng `useContext + useReducer`, tự call API bằng `useEffect`, tự lấy dữ liệu từ Form bằng `useState` (Controlled component).

## Tech Stack tổng quan

| Layer | Technology | Lý do chọn |
|---|---|---|
| Build tool | **Vite + React 18** | Khởi chạy cực nhanh gọn để tập trung học code React |
| Language | **TypeScript** | Buộc phải học cách Define Interface với Data từ API |
| Routing | **React Router v6** | Cần thiết để tạo nhiều trang (React không tự có chức năng này) |
| Styling | **Tailwind CSS + shadcn/ui** | Tối đa hoá tốc độ code UI |
| State (Global) | **React Context + useReducer** | Bắt buộc bản thân nắm chặt khái niệm Prop Drilling và giới hạn của Reducer. |
| Data Fetching | **Khởi tạo custom hook (useFetch + useEffect)** | Rèn luyện thao tác thao túng Component Lifecycle và quản lý cờ trạng thái (loading/error) |
| Forms | **Controlled Components (useState)** | Hiểu rõ cơ chế Rerender 2 chiều khi thao tác trên từng phím bấm của bàn phím. |
| HTTP Client | **fetch native** | Nắm vững Promise và Response object thuần túy trình duyệt |
| Auth | **Context API + localStorage** | Học cách tạo một `<AuthProvider>` bọc gốc ứng dụng và giữ phiên đăng nhập |
| Container | **Docker + Docker Compose** | Dev environment nhất quán với backend |

### Khác biệt so với Next.js

| Next.js | React (Vite) |
|---|---|
| Server Components | Tất cả là Client Components |
| File-based routing (app/) | `createBrowserRouter()` trong code |
| `middleware.ts` | `<PrivateRoute>` component |
| `next/cookies` + httpOnly | Zustand memory + credentials: include |
| ISR / `revalidate` | `staleTime` của TanStack Query |
| `generateStaticParams` | Không cần (SPA) |
| `useRouter` từ next/navigation | `useNavigate` từ react-router-dom |
| `<Link>` từ next/link | `<Link>` từ react-router-dom |
| `searchParams` props | `useSearchParams()` hook |
| `params` props | `useParams()` hook |

---

## Cấu trúc dự án

```
frontend/
├── src/
│   ├── main.tsx                         ← entry point, mount React app
│   ├── App.tsx                          ← router config (createBrowserRouter)
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   │
│   │   ├── shop/
│   │   │   ├── HomePage.tsx             → /
│   │   │   ├── ProductsPage.tsx         → /products
│   │   │   ├── ProductDetailPage.tsx    → /products/:slug
│   │   │   ├── CartPage.tsx             → /cart
│   │   │   ├── CheckoutPage.tsx         → /checkout
│   │   │   ├── CheckoutReturnPage.tsx   → /checkout/return (VNPAY callback)
│   │   │   ├── OrdersPage.tsx           → /orders
│   │   │   └── OrderDetailPage.tsx      → /orders/:id
│   │   │
│   │   └── admin/
│   │       ├── DashboardPage.tsx        → /admin/dashboard
│   │       ├── AdminProductsPage.tsx    → /admin/products
│   │       ├── AdminProductDetailPage.tsx
│   │       └── AdminOrdersPage.tsx
│   │
│   ├── components/
│   │   ├── ui/                          ← shadcn/ui (copy từ CLI)
│   │   ├── layouts/
│   │   │   ├── ShopLayout.tsx           ← navbar + footer
│   │   │   ├── AuthLayout.tsx           ← layout tối giản
│   │   │   └── AdminLayout.tsx          ← sidebar riêng
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
│   │   ├── cartStore.ts                 ← Zustand, sessionStorage persist
│   │   └── authStore.ts                 ← Zustand, memory only
│   │
│   ├── hooks/
│   │   ├── useProducts.ts               ← TanStack Query
│   │   └── useOrders.ts
│   │
│   └── router/
│       └── PrivateRoute.tsx             ← thay thế middleware.ts
│
├── index.html
├── vite.config.ts
├── Dockerfile
└── .env
```

**Nguyên tắc rendering:**
- Tất cả component đều là Client Components — không có Server Components
- Không cần `'use client'` vì mặc định đã là client
- Data fetching hoàn toàn qua TanStack Query hooks
- Không viết CSS custom — 100% Tailwind utilities + shadcn/ui components

---

## Định hướng giao diện (Design & Theme)

- **Theme chủ đạo:** Ưu tiên **Light Theme (Theme Trắng)** làm mặc định (Light-mode first).
- **Tính thẩm mỹ (Aesthetics):** Sử dụng `shadcn/ui` cơ bản với tông màu nền trắng tinh hoặc xám sáng, kết hợp typography đen/xám đậm rõ ràng. Giao diện nên mang phong cách Minimalist (Tối giản) và sang trọng (Premium).
- **Trải nghiệm người dùng:** Tận dụng tối đa khoảng trắng (whitespace) để làm nổi bật trực quan hình ảnh sản phẩm (đặc biệt là cover đĩa Vinyl đầy màu sắc). Hạn chế dùng các dải màu lớn (gradients quá chói) làm tranh giành sự chú ý với sản phẩm.

---

## Phase 8 — Setup & Auth *(song song Phase 1 backend)*

> **Mục tiêu:** Vite + React chạy được, có layout chính, login/register hoạt động.
> **Bắt đầu khi:** Backend có `POST /auth/login`, `POST /auth/register`, `GET /auth/me`.

### 8.1 Project Setup

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Cài Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui (cần cấu hình path alias trước)
npx shadcn@latest init

# Routing + State + Query + Form
npm install react-router-dom zustand @tanstack/react-query react-hook-form zod @hookform/resolvers @react-oauth/google
```

**`vite.config.ts` — path alias `@/`:**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**`src/main.tsx`:**
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

**`src/App.tsx` — router config:**
```tsx
import { createBrowserRouter } from 'react-router-dom';
import ShopLayout from '@/components/layouts/ShopLayout';
import AuthLayout from '@/components/layouts/AuthLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import PrivateRoute from '@/router/PrivateRoute';

import HomePage from '@/pages/shop/HomePage';
import ProductsPage from '@/pages/shop/ProductsPage';
import ProductDetailPage from '@/pages/shop/ProductDetailPage';
import CartPage from '@/pages/shop/CartPage';
import CheckoutPage from '@/pages/shop/CheckoutPage';
import CheckoutReturnPage from '@/pages/shop/CheckoutReturnPage';
import OrdersPage from '@/pages/shop/OrdersPage';
import OrderDetailPage from '@/pages/shop/OrderDetailPage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import DashboardPage from '@/pages/admin/DashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';

export const router = createBrowserRouter([
  {
    element: <ShopLayout />,
    children: [
      { path: '/',                   element: <HomePage /> },
      { path: '/products',           element: <ProductsPage /> },
      { path: '/products/:slug',     element: <ProductDetailPage /> },
      { path: '/cart',               element: <CartPage /> },
      { path: '/checkout',           element: <PrivateRoute><CheckoutPage /></PrivateRoute> },
      { path: '/checkout/return',    element: <CheckoutReturnPage /> },
      { path: '/orders',             element: <PrivateRoute><OrdersPage /></PrivateRoute> },
      { path: '/orders/:id',         element: <PrivateRoute><OrderDetailPage /></PrivateRoute> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <PrivateRoute role="Admin"><AdminLayout /></PrivateRoute>,
    children: [
      { path: '/admin/dashboard', element: <DashboardPage /> },
      { path: '/admin/products',  element: <AdminProductsPage /> },
      { path: '/admin/orders',    element: <AdminOrdersPage /> },
    ],
  },
]);
```

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA routing: mọi path đều trỏ về index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`nginx.conf`** — bắt buộc cho SPA để React Router hoạt động khi refresh:
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

**Bổ sung vào `docker-compose.yml`:**
```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - api
```

---

### 8.2 Types — mirror .NET DTOs

Giữ nguyên hoàn toàn, không thay đổi:

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

Giữ nguyên logic, chỉ đổi `process.env.NEXT_PUBLIC_` → `import.meta.env.VITE_`:

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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
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

  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    credentials: 'include',
  });

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

Giữ nguyên hoàn toàn:

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

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clear: () => set({ accessToken: null, user: null }),
}));
```

```ts
// lib/api/auth.ts — giữ nguyên hoàn toàn
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

  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
};
```

---

### 8.5 PrivateRoute — thay thế middleware.ts

Thay vì `middleware.ts` chạy server-side, dùng component bọc route:

```tsx
// router/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface Props {
  children: React.ReactNode;
  role?: 'Admin' | 'Customer';
}

export default function PrivateRoute({ children, role }: Props) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  // Chưa đăng nhập → về login, giữ lại trang muốn vào
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Không đúng role → về trang chủ
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

**Khôi phục trang sau đăng nhập** — dùng `state.from` trong `LoginPage`:
```tsx
const location = useLocation();
const from = (location.state as { from?: Location })?.from?.pathname ?? '/';
// sau khi login thành công:
navigate(from, { replace: true });
```

---

### 8.6 Layouts

**ShopLayout** — thay `app/(shop)/layout.tsx`:
```tsx
// components/layouts/ShopLayout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/features/Navbar';
import { Footer } from '@/components/features/Footer';
import { CartDrawer } from '@/components/features/CartDrawer';

export default function ShopLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />  {/* ← thay {children} của Next.js */}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
```

**AuthLayout:**
```tsx
// components/layouts/AuthLayout.tsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}
```

**Login Page** — thay `useRouter` → `useNavigate`, `Link` → react-router-dom:
```tsx
// pages/auth/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
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
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore(s => s.setAuth);
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const res = await authApi.login(data.email, data.password);
    setAuth(res.data.accessToken, res.data.user);
    navigate(from, { replace: true });
  }

  return (
    <div className="mx-auto max-w-sm py-20 px-4 text-center">
      <h1 className="text-2xl font-medium mb-8">Đăng nhập</h1>

      <div className="mb-6 flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const res = await authApi.loginWithGoogle(credentialResponse.credential!);
            setAuth(res.data.accessToken, res.data.user);
            navigate(from, { replace: true });
          }}
          onError={() => console.log('Login Failed')}
        />
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
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

      <p className="text-sm text-muted-foreground mt-4">
        Chưa có tài khoản? <Link to="/register" className="underline">Đăng ký</Link>
      </p>
    </div>
  );
}
```

---

## Phase 9 — Product Listing & Detail *(song song Phase 2 backend)*

> **Mục tiêu:** Trang sản phẩm hoàn chỉnh với filter, search, TanStack Query cache.
> **Bắt đầu khi:** Backend có `GET /products`, `GET /products/{slug}`.

### 9.1 Products API

Giữ nguyên hoàn toàn — không thay đổi:

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

### 9.2 TanStack Query hooks

Thay vì fetch trong Server Component, dùng hooks:

```ts
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productsApi, ProductFilters } from '@/lib/api/products';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters),
    staleTime: 1000 * 60 * 60, // 1 giờ — tương đương ISR revalidate: 3600
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.detail(slug),
    staleTime: 1000 * 60 * 60,
    enabled: !!slug,
  });
}
```

---

### 9.3 Product Listing Page

Thay `async Server Component + searchParams props` → hooks + `useSearchParams`:

```tsx
// pages/shop/ProductsPage.tsx
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/features/ProductCard';
import { FilterBar } from '@/components/features/FilterBar';
import { Pagination } from '@/components/features/Pagination';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    page:   Number(searchParams.get('page') ?? 1),
    limit:  24,
    genre:  searchParams.get('genre') ?? undefined,
    format: searchParams.get('format') ?? undefined,
    q:      searchParams.get('q') ?? undefined,
  };

  const { data, isLoading } = useProducts(filters);

  if (isLoading) return <div className="container py-8">Đang tải...</div>;

  const { data: products, meta } = data!;

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <FilterBar
          filters={filters}
          onChange={(key, value) => {
            setSearchParams(prev => {
              const next = new URLSearchParams(prev);
              value ? next.set(key, String(value)) : next.delete(key);
              next.set('page', '1');
              return next;
            });
          }}
        />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">{meta.total} sản phẩm</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={meta.page}
            total={meta.total}
            limit={meta.limit}
            onPageChange={(page) => {
              setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.set('page', String(page));
                return next;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

### 9.4 Product Detail Page

Thay `params` props + `notFound()` → `useParams` + redirect:

```tsx
// pages/shop/ProductDetailPage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { useProductDetail } from '@/hooks/useProducts';
import { AddToCartButton } from '@/components/features/AddToCartButton';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useProductDetail(slug!);

  if (isLoading) return <div className="container py-10">Đang tải...</div>;
  if (isError || !data?.success) return <Navigate to="/404" replace />;

  const product = data.data;

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
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 10 — Cart & Checkout *(song song Phase 3 backend)*

### 10.1 Cart Store

Giữ nguyên hoàn toàn — không thay đổi:

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

### 10.2 Cart Drawer

Thay `useRouter` từ next/navigation → `useNavigate`:

```tsx
// components/features/CartDrawer.tsx
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

export function CartDrawer() {
  const { items, update, remove, total, count } = useCartStore();
  const navigate = useNavigate();

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
          <Button className="w-full" onClick={() => navigate('/checkout')}>
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

Thay `useRouter` → `useNavigate`:

```tsx
// pages/shop/CheckoutPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

    if (res.data.paymentUrl) {
      window.location.href = res.data.paymentUrl;
      return;
    }

    navigate(`/orders/${res.data.orderId}`);
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

### 11.1 VNPAY Return Page

Thay `searchParams` props (Server Component) → `useSearchParams` hook:

```tsx
// pages/shop/CheckoutReturnPage.tsx
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutReturnPage() {
  const [searchParams] = useSearchParams();

  const isSuccess = searchParams.get('vnp_ResponseCode') === '00';
  const orderId   = searchParams.get('vnp_TxnRef');
  const rawAmount = searchParams.get('vnp_Amount');
  const amount    = rawAmount
    ? (Number(rawAmount) / 100).toLocaleString('vi-VN')
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
            <Button asChild><Link to={`/orders/${orderId}`}>Xem đơn hàng</Link></Button>
            <Button variant="outline" asChild><Link to="/">Tiếp tục mua</Link></Button>
          </div>
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-medium mb-2">Thanh toán thất bại</h1>
          <p className="text-muted-foreground mb-6">Vui lòng thử lại hoặc chọn phương thức khác.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link to="/cart">Quay lại giỏ hàng</Link></Button>
            <Button variant="outline" asChild><Link to="/">Về trang chủ</Link></Button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 11.2 Order History & Detail

Thay `async` server fetch → TanStack Query + `useNavigate`:

```ts
// hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { PagedResult, OrderDto, ApiResponse } from '@/lib/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => apiFetch<PagedResult<OrderDto>>('/orders'),
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => apiFetch<ApiResponse<OrderDto>>(`/orders/${id}`),
    enabled: !!id,
  });
}
```

```tsx
// pages/shop/OrdersPage.tsx
import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/features/OrderStatusBadge';

export default function OrdersPage() {
  const { data, isLoading } = useOrders();

  if (isLoading) return <div className="container py-10">Đang tải...</div>;

  const orders = data?.data ?? [];

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-2xl font-medium mb-8">Đơn hàng của tôi</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} to={`/orders/${order.id}`}
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

**`OrderStatusBadge`** — giữ nguyên hoàn toàn:
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

### 12.1 Admin Layout

Thay `cookies()` server-side check → `PrivateRoute` bọc ngoài trong router config:

```tsx
// components/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/features/AdminSidebar';

// Auth/role check đã được xử lý bởi PrivateRoute trong App.tsx
// Không cần check lại ở đây
export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
```

---

### 12.2 Admin Products — CRUD Table

Thay `async` Server Component → TanStack Query:

```tsx
// pages/admin/AdminProductsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { AdminProductsTable } from '@/components/features/AdminProductsTable';
import { useSearchParams } from 'react-router-dom';

export default function AdminProductsPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => productsApi.list({ page, limit: 20 }),
  });

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Sản phẩm</h1>
      </div>
      <AdminProductsTable products={data!.data} meta={data!.meta} />
    </div>
  );
}
```

---

### 12.3 Revenue Dashboard

Thay `Promise.all` server-side → `useQuery` parallel:

```tsx
// pages/admin/DashboardPage.tsx
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { RevenueChart } from '@/components/features/RevenueChart';

export default function DashboardPage() {
  const { data: revenueData } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => apiFetch<{ data: RevenueByMonthDto[] }>('/admin/reports/revenue?months=6'),
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin-order-stats'],
    queryFn: () => apiFetch<{ data: OrderStatsDto }>('/admin/reports/orders'),
  });

  const orders = ordersData?.data;
  const revenue = revenueData?.data;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Đơn hôm nay"     value={orders?.todayCount ?? '—'} />
        <StatCard label="Đơn tháng này"   value={orders?.monthCount ?? '—'} />
        <StatCard label="Doanh thu tháng" value={orders ? `${orders.monthRevenue.toLocaleString('vi-VN')}đ` : '—'} />
        <StatCard label="Đơn chờ xử lý"  value={orders?.pendingCount ?? '—'} />
      </div>

      {revenue && <RevenueChart data={revenue} />}
    </div>
  );
}
```

---

## Phase 13 — AI Chat *(song song Phase 7 backend — Tier 3)*

### 13.1 AI API — SSE ReadableStream

Giữ nguyên hoàn toàn, chỉ đổi `process.env.NEXT_PUBLIC_` → `import.meta.env.VITE_`:

```ts
// lib/api/ai.ts
import { useAuthStore } from '@/store/authStore';

export const aiApi = {
  createConversation: () =>
    fetch(`${import.meta.env.VITE_API_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
      credentials: 'include',
    }).then(r => r.json()),
};

export async function* streamChat(conversationId: string, content: string) {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/conversations/${conversationId}/messages`,
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

Giữ nguyên hoàn toàn — đây đã là Client Component thuần túy:

```tsx
// components/features/AiChat.tsx
import { useState, useRef, useEffect } from 'react';
import { streamChat } from '@/lib/api/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

export function AiChat({ conversationId }: { conversationId: string }) {
  const [messages, setMessages]  = useState<Message[]>([]);
  const [streaming, setStreaming] = useState('');
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);

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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
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
  Vite setup, types, API client, auth store, PrivateRoute, login/register

Phase 9 — Product Listing         ████████░░░░░░░░░░░░░░  Tuần 2 (song song BE Phase 2)
  TanStack Query hooks, filter bar, detail page, useSearchParams

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

- **Vite + React 18** — SPA, HMR, path alias, production build
- **TypeScript** — type-safe API client, types mirror .NET DTOs
- **React Router v6** — `createBrowserRouter`, nested routes, `useParams`, `useSearchParams`
- **PrivateRoute pattern** — client-side auth guard với role check
- **Zustand** — cart store với sessionStorage persist, auth store in-memory
- **TanStack Query** — server state cache, `staleTime`, invalidation, optimistic update
- **React Hook Form + Zod** — form validation mirror FluentValidation backend
- **shadcn/ui + Tailwind CSS** — component-driven UI, không CSS custom
- **Auth flow** — JWT + httpOnly cookie, auto refresh token, redirect sau login
- **VNPAY integration** — redirect flow, return page xử lý `useSearchParams`
- **SSE Streaming** — `fetch + ReadableStream` cho AI Chat *(nếu làm)*
- **Docker** — Dockerfile multi-stage Vite → Nginx, SPA routing config, docker-compose