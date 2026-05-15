import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const isLoginPage = request.nextUrl.pathname === '/login';
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/auth/guru/get-session`, {
      headers: { cookie },
    });

    const session = await response.json();
    const isAuthenticated = session && session.session;

    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
