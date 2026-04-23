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
## Components
- Named exports everywhere except pages (`export function UserCard(...)`)
- 1 component per file, max ~200 LOC, filename = component name
- Props typed via `interface`, no `any`, no `as Type` unless necessary
- Pages are thin shells — all logic goes in feature components or hooks

## State
- Server state → TanStack Query | Global client state → Zustand | Local UI → useState
- Never mix server and client state in the same store

## Hooks & Forms
- 1 hook per file, return typed object (not raw query)
- Forms: Zod schema → infer type → useForm with zodResolver
- Never validate inside submit handlers

## Services & API
- All HTTP via centralized `src/lib/axios.ts` instance
- Services are plain objects with typed async functions, no classes
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
`useEffect` for derived state · abbreviated names · unsanitized `dangerouslySetInnerHTML`