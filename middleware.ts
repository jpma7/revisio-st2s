import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PASSWORD = 'PapaPourLana';
const COOKIE_NAME = 'site-auth';
const HASH = Buffer.from(PASSWORD).toString('base64');

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ne pas protéger la page de login ni les assets statiques
  if (
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(COOKIE_NAME)?.value;
  if (authCookie === HASH) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
