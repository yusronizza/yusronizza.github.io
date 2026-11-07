import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { DEFAULT_LANG, HREFLANG, OG_LOCALE, SUPPORTED_LANGS, isValidLang, localePath, type Lang } from "@/lib/i18n";

type CreateMetadataOptions = {
  lang: Lang;
  title: string;
  description: string;
  /** Path without a language prefix, e.g. "/blog/my-post". */
  path: string;
  /** Set true for the homepage so the title isn't run through the template. */
  isRoot?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  imageUrl?: string;
  /** Languages this page exists in (default: all). Drives hreflang. */
  availableLangs?: string[];
  noIndex?: boolean;
};

// hreflang alternates for a page: one URL per language it exists in, plus
// x-default pointing at the English (unprefixed) URL.
export function languageAlternates(path: string, available: readonly string[] = SUPPORTED_LANGS) {
  const langs = SUPPORTED_LANGS.filter((l) => available.includes(l));
  const languages: Record<string, string> = {};
  for (const l of langs) languages[HREFLANG[l]] = `${siteConfig.url}${localePath(l, path)}`;
  if (langs.includes(DEFAULT_LANG)) languages["x-default"] = `${siteConfig.url}${path}`;
  return languages;
}

export function createMetadata({
  lang,
  title,
  description,
  path,
  isRoot = false,
  type = "website",
  publishedTime,
  tags,
  imageUrl,
  availableLangs,
  noIndex,
}: CreateMetadataOptions): Metadata {
  const localized = localePath(lang, path);
  const url = `${siteConfig.url}${localized}`;
  const resolvedTitle = isRoot ? title : `${title} | ${siteConfig.name}`;
  const others = (availableLangs ?? SUPPORTED_LANGS).filter((l): l is Lang => isValidLang(l) && l !== lang);

  return {
    // The homepage sets its full title; every other page gives a short one
    // that the layout's template completes.
    ...(isRoot ? { title: { absolute: title } } : { title }),
    description,
    alternates: {
      canonical: localized,
      languages: languageAlternates(path, availableLangs),
      types: { "application/rss+xml": `${siteConfig.url}${localePath(lang, "/feed.xml")}` },
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: OG_LOCALE[lang],
      alternateLocale: others.map((l) => OG_LOCALE[l]),
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && tags ? { tags } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
