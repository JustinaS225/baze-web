import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { i18n } from './i18n-config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  )

  const locale = matchLocale(languages, locales, i18n.defaultLocale)
  
  return locale
}

export async function middleware(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;

  // Locale Detection (as in the first middleware)
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  return NextResponse.next();

    // USE THIS if getLocale function is needed (getLocale function detects user's browser 
    // prefered language and if prefered language is one of the languages that the page has, it throws that language)
    
    // return NextResponse.redirect(
    //   new URL(
    //     `/${locale || i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
    //     request.url
    //   )
    // )
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}