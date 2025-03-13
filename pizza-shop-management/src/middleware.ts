import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

export default async function middleware(request: NextRequest) {
  // In middleware, we need to use getToken instead of auth()
  const token = await getToken({ req: request });

  // Check if the user is authenticated
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const role = token?.role as UserRole | undefined;

  // Redirect unauthenticated users to login page
  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle role-based access
  if (isAuth) {
    // Admin routes - only admin and managers can access
    if (
      request.nextUrl.pathname.startsWith('/dashboard/admin') &&
      role !== UserRole.ADMIN &&
      role !== UserRole.MANAGER
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Kitchen routes - only kitchen, admin, and managers can access
    if (
      request.nextUrl.pathname.startsWith('/dashboard/kitchen') &&
      role !== UserRole.KITCHEN &&
      role !== UserRole.ADMIN &&
      role !== UserRole.MANAGER
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Server routes - only servers, admin, and managers can access
    if (
      request.nextUrl.pathname.startsWith('/dashboard/server') &&
      role !== UserRole.SERVER &&
      role !== UserRole.ADMIN &&
      role !== UserRole.MANAGER
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Paths that require authentication
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};