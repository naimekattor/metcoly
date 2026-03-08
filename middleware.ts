import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './nextInt/config';

// 1. Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(req: NextRequest) {
  // Extract path and token
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('accessToken')?.value;

  // We decode the basic structure of the token if it exists to get the role
  // IMPORTANT: Since we are in Edge Middleware, we can't use full jsonwebtoken.
  // We can just base64 decode the payload if we want true RBAC, or we just rely
  // on checking if there's *any* token for now, and handle role redirects inside the app.

  // For basic protection (dashboard paths must be authenticated)
  if (pathname.includes('/dashboard')) {
    if (!token) {
      // Redirect to login (maintaining locale if needed by extracting it)
      const url = req.nextUrl.clone();
      // A quick way to jump to login
      url.pathname = '/login'; // Or specific locale like /en/login
      return NextResponse.redirect(url);
    }

    // Role decoding (basic base64 string manipulation for Edge compatibility)
    let userRole = '';
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
      const payload = JSON.parse(decodedJson);
      userRole = payload.role;
    } catch (e) {
      // Invalid token format
      console.error('Failed to parse token in middleware', e);
    }

    // RBAC: Check roles
    if (pathname.includes('/dashboard/super-admin') && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.includes('/dashboard/consultant') && !['SUPER_ADMIN', 'CONSULTANT'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.includes('/dashboard/user') && userRole !== 'CLIENT') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 2. Run i18n middleware after auth checks
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};