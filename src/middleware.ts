import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Root /dashboard redirect based on role cookie
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    const roleCookie = request.cookies.get('tms_user_role')?.value;
    if (roleCookie === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (roleCookie === 'dispatcher') {
      return NextResponse.redirect(new URL('/dispatcher/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/broker/dashboard', request.url));
  }

  // 2. Direct /admin root redirect
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // 3. Legacy root routes redirect based on role
  if (pathname === '/loads') {
    const roleCookie = request.cookies.get('tms_user_role')?.value;
    if (roleCookie === 'admin') {
      return NextResponse.redirect(new URL('/admin/loads', request.url));
    }
    if (roleCookie === 'dispatcher') {
      return NextResponse.redirect(new URL('/dispatcher/loads', request.url));
    }
    return NextResponse.redirect(new URL('/broker/loads', request.url));
  }

  if (pathname === '/loads/new') {
    return NextResponse.redirect(new URL('/broker/loads/new', request.url));
  }

  if (pathname === '/shippers') {
    return NextResponse.redirect(new URL('/broker/shippers', request.url));
  }

  if (pathname === '/carriers') {
    return NextResponse.redirect(new URL('/broker/carriers', request.url));
  }

  if (pathname === '/accounting') {
    return NextResponse.redirect(new URL('/broker/accounting', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/admin',
    '/loads/:path*',
    '/loads',
    '/shippers/:path*',
    '/shippers',
    '/carriers/:path*',
    '/carriers',
    '/accounting/:path*',
    '/accounting',
  ],
};
