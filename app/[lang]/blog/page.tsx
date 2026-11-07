import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { PostCard } from "@/components/blog/post-card";
import { PostsControls } from "@/components/blog/posts-controls";
import { DEFAULT_LIMIT, isValidLimit } from "@/lib/blog/pagination";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getPosts, searchPosts } from "@/lib/api/posts";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";
import { resolveLang } from "@/lib/i18n/params";

type BlogSearch = { q?: string; cursor?: string; limit?: string; tag?: string };
type BlogPageProps = { params: Promise<{ lang: string }>; searchParams: Promise<BlogSearch> };

export async function generateMetadata({ params, searchParams }: BlogPageProps): Promise<Metadata> {
  const [lang, sp] = await Promise.all([resolveLang(params), searchParams]);
  const t = getDictionary(lang).blog;
  // Search results and deeper pages are useful to visitors but not as search
  // results of their own; the canonical listing is /blog.
  const filtered = !!(sp.q || sp.cursor || sp.limit);
  return createMetadata({ lang, title: t.eyebrow, description: t.description, path: "/blog", noIndex: filtered });
}

const paginationBase = "inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium";
const navLinkClass = `${paginationBase} transition-colors hover:border-accent hover:text-accent`;
const disabledClass = `${paginationBase} text-muted opacity-40 cursor-not-allowed select-none`;

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const [lang, { q = "", cursor, limit: limitParam, tag = "" }] = await Promise.all([resolveLang(params), searchParams]);
  const t = getDictionary(lang).blog;
  const rawLimit = Number(limitParam);
  const limit = isValidLimit(rawLimit) ? rawLimit : DEFAULT_LIMIT;
  const trimmedQ = q.trim();

  // Search and tag are mutually exclusive; search takes priority.
  const { data: posts, meta } = trimmedQ
    ? await searchPosts({ q: trimmedQ, limit, cursor, lang })
    : await getPosts({ limit, cursor, tag: tag || undefined, lang });

  const pageUrl = (c: string) => buildPageUrl(lang, { q, limit, tag, cursor: c });

  return (
    <>
      <JsonLd data={breadcrumbSchema(lang, [{ name: t.eyebrow, path: "/blog" }])} />
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="py-8 sm:py-10">
        <PostsControls
          key={`${q}|${tag}|${limit}`}
          basePath={localePath(lang, "/blog")}
          initialQ={q}
          initialLimit={limit}
          initialTag={tag}
          labels={{
            search: t.search,
            clearSearch: t.clearSearch,
            perPage: t.perPage,
            filteringBy: t.filteringBy,
            tag: t.tag,
            removeTag: t.removeTag(tag),
          }}
        />
      </div>

      {posts.length === 0 ? (
        <p className="py-12 text-sm text-muted">{trimmedQ ? t.noResults(trimmedQ) : tag ? t.noTagged(tag) : t.noPosts}</p>
      ) : (
        <div className="grid gap-4 pb-12 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} />
          ))}
        </div>
      )}

      <nav aria-label={t.eyebrow} className="flex flex-wrap items-center justify-between gap-4 border-t border-border pb-12 pt-6">
        <p className="text-sm text-muted">{t.total(meta.total)}</p>
        <div className="flex items-center gap-3">
          {meta.prevCursor ? (
            <Link href={pageUrl(meta.prevCursor)} rel="prev" className={navLinkClass}>
              <span aria-hidden="true">←</span>
              {t.previous}
            </Link>
          ) : (
            <span className={disabledClass} aria-disabled="true">
              <span aria-hidden="true">←</span>
              {t.previous}
            </span>
          )}
          {meta.nextCursor ? (
            <Link href={pageUrl(meta.nextCursor)} rel="next" className={navLinkClass}>
              {t.next}
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className={disabledClass} aria-disabled="true">
              {t.next}
              <span aria-hidden="true">→</span>
            </span>
          )}
        </div>
      </nav>
    </>
  );
}

function buildPageUrl(lang: Lang, { q, limit, tag, cursor }: { q: string; limit: number; tag: string; cursor: string }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (limit !== DEFAULT_LIMIT) params.set("limit", String(limit));
  if (tag && !q) params.set("tag", tag);
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();
  return `${localePath(lang, "/blog")}${qs ? `?${qs}` : ""}`;
}
