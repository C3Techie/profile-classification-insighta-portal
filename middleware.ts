import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths
  if (path === '/') {
    return NextResponse.next();
  }

  const refresh_token = request.cookies.get('insighta_refresh');

  // If no refresh token, redirect to login
  if (!refresh_token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Note: We don't verify JWT here (security check is on backend), 
  // we just check if cookies exist to allow page transitions.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profiles/:path*',
    '/search/:path*',
    '/account/:path*',
  ],
};
