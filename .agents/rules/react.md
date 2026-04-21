---
trigger: always_on
---

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

## Component Rules
- 1 component per file, maximum ~200 LOC
- File name = Component name: `LoginForm.tsx`
- Use **named exports** for components, not default exports (except pages/routes)
- No business logic in Page components — delegate to feature components
- Prefer composition over large monolithic components

```tsx
// ✅ Named export
export function UserCard({ user }: UserCardProps) { ... }

// ❌ Avoid default export except for pages
export default function UserCard() { ... }
```

## TypeScript
- Always define `Props` type for every component
- No `any` — use `unknown` and narrow the type
- No type assertions (`as SomeType`) unless absolutely necessary
- Use `interface` for object shapes, `type` for unions/intersections
- Always use explicit types; never use implicit `any` or rely on unsafe inference

```tsx
// ✅
interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
}

// ❌
function UserCard(props: any) { ... }
```

## Naming Conventions
- Components: `PascalCase` → `LoginForm`, `UserCard`
- Hooks: `camelCase` prefixed with `use` → `useAuth`, `useUserList`
- Services: `camelCase` suffixed with `Service` → `authService`, `userService`
- Types/Interfaces: `PascalCase` → `User`, `LoginRequest`
- Constants: `SCREAMING_SNAKE_CASE` → `MAX_RETRY_COUNT`
- Files: match export name → `LoginForm.tsx`, `useAuth.ts`
- **No abbreviated names**: use `user`, `order`, `response` — not `u`, `o`, `res`

## State Management
- **Server state** (API data) → TanStack Query
- **Global client state** (auth, theme, UI) → Zustand
- **Local UI state** (form, toggle, modal) → `useState`
- Do not mix server state and client state in the same store

```tsx
// ✅ Server state with React Query
const { data: user, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => userService.getById(userId),
});

// ✅ Global state with Zustand
const { currentUser, setAuth } = useAuthStore();

// ✅ Local UI state
const [isOpen, setIsOpen] = useState(false);
```

## Hooks
- Extract logic from components into custom hooks
- 1 hook per file, file name matches hook name: `useAuth.ts`
- Hooks must return a typed object, not a raw array (except `useState`-style pairs)
- Always clean up side effects in `useEffect`

```tsx
// ✅
export function useUserList(filters: UserFilters) {
  const query = useQuery({ ... });
  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

// ❌ Returning raw untyped object
export function useUserList() {
  return useQuery({ ... });
}
```

## Forms
- Always use **React Hook Form + Zod**
- Define Zod schema separately, derive TypeScript type from it
- Never use uncontrolled inputs without React Hook Form
- Validate at the form level, not inside submit handlers

```tsx
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
});
```

## API & Services
- All HTTP calls go through a centralized **Axios instance** (`src/lib/axios.ts`)
- Services are plain objects with async functions — no classes
- Always type request and response shapes
- Handle errors in a centralized Axios interceptor, not in each service

```tsx
// ✅ src/features/auth/services/authService.ts
export const authService = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return data;
  },
};

// ❌ Direct fetch/axios usage in components
const res = await axios.post('/auth/login', payload);
```

## Error Handling
- Use a **Result pattern** or let TanStack Query handle error state
- Never `try/catch` inside components — handle in services or query hooks
- Show user-friendly error messages, never expose raw API errors
- Use React Error Boundaries for unexpected rendering errors

```tsx
// ✅ Error handled by React Query
const { data, error, isError } = useQuery({ ... });
if (isError) return <ErrorMessage message={error.message} />;
```

## Routing
- Route definitions in a single `src/routes.tsx` file
- Page components are thin wrappers — no business logic
- Use `<Navigate>` for redirects, `useNavigate` for programmatic navigation
- Protect private routes with a `<ProtectedRoute>` wrapper component

```tsx
// ✅
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

## Performance
- Use `React.memo` only when profiling shows a real re-render problem — not by default
- Use `useCallback` and `useMemo` only for expensive operations or stable references
- Use `React.lazy` + `Suspense` for route-level code splitting
- Images: always set `width` and `height` attributes to avoid layout shift

```tsx
// ✅ Lazy loading routes
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));

<Suspense fallback={<PageSkeleton />}>
  <Dashboard />
</Suspense>
```

## Security
- Never store access tokens in `localStorage` — use `HttpOnly` cookies
- Sanitize any user-generated HTML with `DOMPurify` before rendering
- Never use `dangerouslySetInnerHTML` without sanitization
- Validate all inputs on the client AND rely on server validation as source of truth

```tsx
// ❌
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

## Testing
- Unit: Vitest + React Testing Library
- Test behavior, not implementation
- Query elements by role/label, not by class or test ID
- Integration: Mock API calls with `msw` (Mock Service Worker)

```tsx
// ✅
const button = screen.getByRole('button', { name: /sign in/i });
await userEvent.click(button);
expect(screen.getByText(/invalid email/i)).toBeInTheDocument();

// ❌
const button = container.querySelector('.submit-btn');
```

## Conventions
- Async functions: suffix with `Async` only for non-event-handler utilities
- Event handlers: prefix with `handle` → `handleSubmit`, `handleDelete`
- Boolean props/state: prefix with `is/has/can` → `isLoading`, `hasError`
- File-level constants at the top of the file, above the component
- No inline styles — use Tailwind classes
- Avoid prop drilling beyond 2 levels — lift to Zustand or Context

## Prohibited (Don'ts)
- `any` type
- `dangerouslySetInnerHTML` without `DOMPurify`
- Direct `localStorage` for tokens
- Business logic inside Page components
- API calls directly inside components (use services + React Query)
- Mutating state directly: `user.name = 'An'` instead of `setUser({ ...user, name: 'An' })`
- `useEffect` for derived state — compute inline or use `useMemo`
- Abbreviated variable names (`u`, `o`, `res`, `e` except for native events)
- Catching errors silently without logging or user feedback