import { i18nConfig } from '@/src/lib/i18n';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(['de', 'en', 'fr', 'es']);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

const cookieName = 'NEXT_LOCALE';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Check if there is a language cookie
  let locale = req.cookies.get(cookieName)?.value;
  
  // If no cookie, use accept-language header
  if (!locale) {
    locale = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  
  // If no accept-language header, use default locale
  if (!locale) {
    locale = i18nConfig.i18n.defaultLocale;
  }
  
  // Only set locale if it's in our supported locales
  if (i18nConfig.i18n.locales.includes(locale)) {
    res.cookies.set(cookieName, locale);
  }
  
  // Create supabase middleware client
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  await supabase.auth.getSession();
  
  return res;
}
