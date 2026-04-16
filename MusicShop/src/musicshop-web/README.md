# MusicShop - Vite + React (Vanilla Mode)

This is a React SPA project migrated from Next.js. It has been stripped of third-party "magic" libraries to focus on core React concepts.

## Tech Stack
- **Framework**: React 19 + Vite 8
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4 + Lucide Icons
- **Auth**: Google OAuth + Vanilla React Context
- **API**: Axios

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `src/context`: Global states (AuthContext)
- `src/layouts`: Layout wrappers
- `src/pages`: Page components
- `src/components`: UI components (shadcn/ui)
- `src/services`: API clients

## Deep-Dive Focus
- No Zustand/Redux (Using `useContext`)
- No React Hook Form (Using `useState` controlled components)
- No Zod (Custom validation)
- No TanStack Query (Using `useEffect` + `useState`)
