import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getProjects } from "@/lib/api/projects";
import { getAllPosts } from "@/lib/api/posts";
import { SUPPORTED_LANGS, localePath, type Lang } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo/metadata";

export const revalidate = 3600;

// One entry per page per language, each listing its translations
// (hreflang alternates), so search engines index every language version.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entry = (lang: Lang, path: string, extra: Partial<MetadataRoute.Sitemap[number]>, available?: string[]) => ({
    url: `${siteConfig.url}${localePath(lang, path)}`,
    alternates: { languages: languageAlternates(path, available) },
    ...extra,
  });

  const staticPages: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
    ["/", "monthly", 1],
    ["/about", "yearly", 0.8],
    ["/cv", "monthly", 0.8],
    ["/projects", "weekly", 0.9],
    ["/blog", "weekly", 0.9],
    ["/contact", "yearly", 0.6],
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const lang of SUPPORTED_LANGS) {
    for (const [path, changeFrequency, priority] of staticPages) {
      entries.push(entry(lang, path, { changeFrequency, priority }));
    }
  }

  // Posts and projects only exist in the languages they were translated into.
  const perLang = await Promise.all(
    SUPPORTED_LANGS.map(async (lang) => ({
      lang,
      posts: await getAllPosts(lang).catch(() => []),
      projects: await getProjects({ lang }).catch(() => []),
    }))
  );
  for (const { lang, posts, projects } of perLang) {
    for (const post of posts) {
      if (post.locale && post.locale !== lang) continue; // a fallback, not a translation
      entries.push(entry(lang, `/blog/${post.slug}`, { lastModified: post.publishedAt, changeFrequency: "monthly", priority: 0.6 }, post.availableLocales));
    }
    for (const project of projects) {
      if (project.locale && project.locale !== lang) continue;
      entries.push(entry(lang, `/projects/${project.slug}`, { changeFrequency: "monthly", priority: 0.6 }, project.availableLocales));
    }
  }
  return entries;
}
