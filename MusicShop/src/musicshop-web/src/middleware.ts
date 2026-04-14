import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = ['/profile', '/dashboard', '/orders'];
// Define routes for guests only (already logged-in users should be redirected away)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 1. Check if the user is accessing a protected route without a token
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optional: Save the attempted URL to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Check if an authenticated user is trying to access auth routes (login/register)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Run middleware only for specific paths to optimize performance
export const config = {
  matcher: ['/profile/:path*', '/dashboard/:path*', '/login', '/register'],
};
