import { getAllPosts } from "@/lib/api/posts";
import { siteConfig } from "@/lib/config/site";
import { getDictionary, HREFLANG, SUPPORTED_LANGS, isValidLang, localePath } from "@/lib/i18n";

// RSS 2.0 feed of published posts, one per language (/feed.xml, /ja/feed.xml,
// /id/feed.xml). Cached like the pages and refreshed with the "posts" tag.
export const revalidate = 3600;
export function generateStaticParams() {
  if (process.env.SKIP_PRERENDER === "1") return [];
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isValidLang(raw)) return new Response("Not found", { status: 404 });
  const lang = raw;
  const t = getDictionary(lang).blog;
  const posts = await getAllPosts(lang).catch(() => []);
  const site = siteConfig.url;
  const blogUrl = `${site}${localePath(lang, "/blog")}`;

  const items = posts
    .map((post) => {
      const url = `${site}${localePath(lang, `/blog/${post.slug}`)}`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.excerpt)}</description>
      <pubDate>${new Date(`${post.publishedAt.slice(0, 10)}T00:00:00Z`).toUTCString()}</pubDate>
${post.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${t.title} — ${siteConfig.name}`)}</title>
    <link>${blogUrl}</link>
    <description>${escape(t.description)}</description>
    <language>${HREFLANG[lang]}</language>
    <atom:link href="${site}${localePath(lang, "/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
