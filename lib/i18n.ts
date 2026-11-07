export const SUPPORTED_LANGS = ["en", "ja", "id"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const LANG_COOKIE = "lang";
export const DEFAULT_LANG: Lang = "en";

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  ja: "日本語",
  id: "ID",
};

export function isValidLang(v: unknown): v is Lang {
  return SUPPORTED_LANGS.includes(v as Lang);
}
