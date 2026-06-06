import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = [
  '/dashboard', '/doctor', '/agent', '/api/chat', '/api/mood', 
  '/api/scan', '/api/patient-record', '/api/diagnoses', '/api/emergency-contacts'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Check if route is protected
  const isProtected = PROTECTED_PREFIXES.some(p => 
    pathname.startsWith(p) || 
    routing.locales.some(loc => pathname.startsWith(`/${loc}${p}`))
  );

  let userId = '';
  let userRole = '';

  if (isProtected) {
    const token = req.cookies.get('selam_token')?.value;
    
    if (!token) {
      const localeMatch = pathname.match(/^\/(en|am|ti|om)/);
      const localePrefix = localeMatch ? localeMatch[0] : '';
      return NextResponse.redirect(new URL(`${localePrefix}/auth/login`, req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345');
      const { payload } = await jwtVerify(token, secret);
      userId = payload.id as string;
      userRole = payload.role as string;
    } catch {
      const localeMatch = pathname.match(/^\/(en|am|ti|om)/);
      const localePrefix = localeMatch ? localeMatch[0] : '';
      return NextResponse.redirect(new URL(`${localePrefix}/auth/login`, req.url));
    }
  }

  // 2. Handle API routes directly
  if (pathname.startsWith('/api')) {
    const headers = new Headers(req.headers);
    if (userId) headers.set('x-user-id', userId);
    if (userRole) headers.set('x-user-role', userRole);
    return NextResponse.next({ request: { headers } });
  }

  // 3. Handle next-intl pages
  const res = intlMiddleware(req);
  
  // Apply our custom headers to the response so they are available in downstream handlers
  // In Next.js middleware, setting headers on the response can act as request headers for the destination 
  // if you use x-middleware-request-* headers, but setting directly is usually fine.
  if (userId) res.headers.set('x-user-id', userId);
  if (userRole) res.headers.set('x-user-role', userRole);
  
  return res;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public|.*\\..*).*)']
};
