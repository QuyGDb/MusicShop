# React — Coding Rules

## Stack
- React 19+, TypeScript 5+, `strict: true`, Vite
- TailwindCSS + shadcn/ui for UI components
- React Router v6 for routing
- TanStack Query (React Query) for server state
- Zustand for global state
- Tanstack Form
- Axios 
- Zod

## Project Structure
```
src/
  assets/          # Static files (images, fonts, icons)
  components/      # Shared/reusable UI components
    ui/            # Primitive components (Button, Input, Card...)
    common/        # Composite shared components (Navbar, Sidebar...)
  features/        # Feature-based modules
    auth/
      components/  # Components scoped to this feature
      hooks/       # Hooks scoped to this feature
      services/    # API calls for this feature
      types/       # Types/interfaces for this feature
  hooks/           # Global custom hooks
  lib/             # Third-party config (axios instance, queryClient...)
  pages/           # Route-level components (thin, no logic)
  services/        # Global API services
  store/           # Zustand global stores
  types/           # Global TypeScript types/interfaces
  utils/           # Pure utility functions
```

## Architecture Pattern: Custom Hook + Presentational Component
Every feature component MUST follow the Hook + Component separation:
- **Hook** (`useXxx`): Contains ALL business logic — state, mutations, handlers, derived values
- **Component**: Contains ONLY JSX rendering — receives everything from hook, zero logic

### Hook Rules (Contract)
- Hook does NOT import any component, does NOT return JSX
- Hook does NOT know about CSS, className, or any UI concept
- Return interface must be self-describing: `isLoading`, `isEmpty`, `isSubmitting`, `handleDelete`
- Return a typed object, never a raw query or tuple

### Component Rules (Render)
- Component does NOT call services directly
- Component does NOT contain `useState` for business state (only local UI state like `isHovered`)
- Component does NOT contain `useEffect` for side effects
- All data and handlers come from the hook

## Components
- Named exports everywhere except pages (`export function UserCard(...)`)
- 1 component per file, max ~200 LOC, filename = component name
- Props typed via `interface`, no `any`, no `as Type` unless necessary
- Pages are thin shells — all logic goes in feature components or hooks
- `ui/` directory: Primitive components ONLY (Button, Input, Card) — no service calls, no side effects
- `common/` directory: Composite shared components (ImageUpload, Navbar) — may use hooks

## State
- Server state → TanStack Query | Global client state → Zustand | Local UI → useState
- Never mix server and client state in the same store

## Hooks & Forms
- 1 hook per file, return typed object (not raw query)
- Every feature with CRUD must have a dedicated management hook (e.g., `useGenreManagement`)
- Form logic must live in a dedicated hook (e.g., `useArtistForm`), not in the component
- Forms: Zod schema → infer type → useForm with zodResolver
- Never validate inside submit handlers

## Services & API
- All HTTP via centralized `src/lib/axios.ts` instance
- **Unwrapped Responses**: `axiosInstance` returns `response.data` trực tiếp. Service functions phải return data type, không bọc trong `AxiosResponse`.
- **Error Handling**: 
  - Logic xử lý lỗi tập trung tại Axios interceptors.
  - Interceptors chuyển đổi `ProblemDetails` (RFC 7807) thành standard JavaScript `Error` objects với `message` đã được format.
  - **QUAN TRỌNG**: Components và hooks PHẢI sử dụng `error.message` để hiển thị lỗi. KHÔNG truy cập `error.response` vì thông tin này sẽ bị mất sau khi interceptor transform error.
- Services là plain objects với typed async functions, không dùng classes
- Error handling in Axios interceptors, not in components or services

## Naming
- Components: PascalCase | Hooks: useXxx | Services: xxxService
- Booleans: isX / hasX / canX | Handlers: handleX | Constants: SCREAMING_SNAKE_CASE
- No abbreviations: `user` not `u`, `response` not `res`

## Routing & Security
- Route definitions in single `src/routes.tsx`; private routes via `<ProtectedRoute>`
- No tokens in localStorage (use HttpOnly cookies)
- Sanitize HTML with DOMPurify before `dangerouslySetInnerHTML`

## Prohibited
`any` · unsafe `as` casts · localStorage for tokens · business logic in pages ·
direct axios in components · silent catch · mutating state directly ·
`useEffect` for derived state · abbreviated names · unsanitized `dangerouslySetInnerHTML` ·
service calls inside components · `useState` for business state in components ·
mixing business logic and JSX in the same file (unless component is < 30 LOC)
