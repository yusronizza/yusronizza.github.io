// Locales, URL helpers, and the interface dictionary.
//
// URL scheme: English lives at the unprefixed path (/blog/x); Japanese and
// Indonesian at /ja/... and /id/.... Internally every page is under
// app/[lang]; proxy.ts rewrites unprefixed URLs to /en.

export const SUPPORTED_LANGS = ["en", "ja", "id"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const LANG_LABELS: Record<Lang, string> = { en: "EN", ja: "日本語", id: "ID" };
export const LANG_NAMES: Record<Lang, string> = { en: "English", ja: "日本語", id: "Bahasa Indonesia" };
// BCP 47 for <html lang>/hreflang, and Open Graph's underscore form.
export const HREFLANG: Record<Lang, string> = { en: "en", ja: "ja", id: "id" };
export const OG_LOCALE: Record<Lang, string> = { en: "en_US", ja: "ja_JP", id: "id_ID" };

export function isValidLang(v: unknown): v is Lang {
  return SUPPORTED_LANGS.includes(v as Lang);
}

// "/blog/x" in `lang`: unchanged for English, "/ja/blog/x" otherwise.
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

// The language of a browser pathname and the path without its prefix.
export function splitLocale(pathname: string): { lang: Lang; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isValidLang(first) && first !== DEFAULT_LANG) return { lang: first, path: `/${rest.join("/")}` };
  return { lang: DEFAULT_LANG, path: pathname || "/" };
}

export { getDictionary, type Dictionary } from "./dictionaries";
