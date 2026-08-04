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

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Notes on software engineering, architecture and building things.",
  path: "/blog",
});

const navLinkClass =
  "inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent";
const disabledClass =
  "inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted opacity-40 cursor-not-allowed select-none";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cursor?: string; limit?: string; tag?: string }>;
}) {
  const { q = "", cursor, limit: limitParam, tag = "" } = await searchParams;

  const rawLimit = Number(limitParam);
  const limit = isValidLimit(rawLimit) ? rawLimit : DEFAULT_LIMIT;

  // search and tag are mutually exclusive — search takes priority
  const { data: posts, meta } =
    q.trim()
      ? await searchPosts({ q: q.trim(), limit, cursor })
      : await getPosts({ limit, cursor, tag: tag || undefined });

  const isEmpty = posts.length === 0;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }])} />
      <PageHeader
        eyebrow="Blog"
        title="Writing"
        description="Notes on software engineering, architecture and building things."
      />

      <div className="py-8 sm:py-10">
        <PostsControls initialQ={q} initialLimit={limit} initialTag={tag} />
      </div>

      {isEmpty ? (
        <p className="py-12 text-sm text-muted">
          {q.trim()
            ? `No posts matched “${q.trim()}”.`
            : tag
            ? `No posts tagged “${tag}”.`
            : "No posts yet."}
        </p>
      ) : (
        <div className="grid gap-4 pb-12 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pb-12 pt-6">
        <p className="text-sm text-muted">
          {meta.total} post{meta.total !== 1 ? "s" : ""} total
        </p>

        <div className="flex items-center gap-3">
          {meta.prevCursor ? (
            <Link
              href={buildPageUrl({ q, limit, tag, cursor: meta.prevCursor })}
              className={navLinkClass}
            >
              <span aria-hidden="true">←</span>
              Previous
            </Link>
          ) : (
            <span className={disabledClass} aria-disabled="true">
              <span aria-hidden="true">←</span>
              Previous
            </span>
          )}

          {meta.nextCursor ? (
            <Link
              href={buildPageUrl({ q, limit, tag, cursor: meta.nextCursor })}
              className={navLinkClass}
            >
              Next
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className={disabledClass} aria-disabled="true">
              Next
              <span aria-hidden="true">→</span>
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function buildPageUrl({
  q,
  limit,
  tag,
  cursor,
}: {
  q: string;
  limit: number;
  tag: string;
  cursor: string;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (limit !== DEFAULT_LIMIT) params.set("limit", String(limit));
  if (tag && !q) params.set("tag", tag);
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();
  return `/blog${qs ? `?${qs}` : ""}`;
}
