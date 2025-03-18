import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// We need to use token validation directly in Edge rather than the full auth implementation
export async function middleware(request: NextRequest) {
  // Debug logs only in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookies:', request.cookies.getAll().map(c => c.name));
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
    secureCookie: process.env.NODE_ENV === 'production',
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('Middleware token:', token ? 'Found' : 'Not found');
  }

  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isCustomerPage = request.nextUrl.pathname.startsWith('/customer');
  const isRootPage = request.nextUrl.pathname === '/';
  const isDashboardPage = request.nextUrl.pathname === '/dashboard';
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isApiAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');

  // Bypass middleware for API auth routes to prevent interference
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect root to customer page
  if (isRootPage) {
    return NextResponse.redirect(new URL('/customer', request.url));
  }

  // Allow access to customer page without authentication
  if (isCustomerPage) {
    return NextResponse.next();
  }

  // Allow access to auth pages without authentication
  if (isAuthPage && !isAuth) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login page for protected routes
  if (!isAuth && isDashboardRoute) {
    const signinUrl = new URL('/auth/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle role-based access control
  if (isAuth && token.role) {
    const userRole = token.role as string;
    const isAdminRoute = request.nextUrl.pathname.startsWith('/dashboard/admin');
    const isKitchenRoute = request.nextUrl.pathname.startsWith('/dashboard/kitchen');
    const isServerRoute = request.nextUrl.pathname.startsWith('/dashboard/server');

    // Redirect from main dashboard to role-specific dashboard
    if (isDashboardPage) {
      switch (userRole) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        case 'KITCHEN':
          return NextResponse.redirect(new URL('/dashboard/kitchen', request.url));
        case 'SERVER':
          return NextResponse.redirect(new URL('/dashboard/server', request.url));
        default:
          return NextResponse.redirect(new URL('/customer', request.url));
      }
    }

    // Prevent access to unauthorized role-specific routes
    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isKitchenRoute && userRole !== 'KITCHEN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isServerRoute && userRole !== 'SERVER') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Paths that require authentication
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/auth/:path*',
    '/customer/:path*',
  ],
};