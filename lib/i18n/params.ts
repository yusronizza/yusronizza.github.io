import { notFound } from "next/navigation";
import { isValidLang, type Lang } from "./index";

export type LangParams = { params: Promise<{ lang: string }> };
export type LangSlugParams = { params: Promise<{ lang: string; slug: string }> };

// The validated language of a page (the root layout already restricts it to
// the supported set; this narrows the type and guards direct calls).
export async function resolveLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  return lang;
}
