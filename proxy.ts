import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "@/lib/i18n";

// Language routing. Every page lives under app/[lang]; English is served at
// unprefixed URLs, which are rewritten to /en internally. A visible /en/...
// URL redirects to its unprefixed form, so each page has one English URL.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === DEFAULT_LANG) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LANG.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if ((SUPPORTED_LANGS as readonly string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANG}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes, Next internals, and root-level files
  // (sitemap, robots, manifest, icons, the CV PDF, images…).
  matcher: ["/((?!api/|_next/|_vercel/|.*\\.[a-zA-Z0-9]+$).*)", "/feed.xml"],
};
