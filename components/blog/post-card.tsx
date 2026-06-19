import Link from "next/link";
import { formatDate } from "@/lib/utils/format";
import type { Post } from "@/lib/data/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block border-b border-border py-6 first:pt-0 last:border-b-0"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-lg font-semibold tracking-tight group-hover:text-accent">
          {post.title}
        </h3>
        <time
          dateTime={post.publishedAt}
          className="shrink-0 font-mono text-xs text-muted"
        >
          {formatDate(post.publishedAt)}
        </time>
      </div>
      <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
      <p className="mt-2 text-xs text-muted">{post.readingTimeMinutes} min read</p>
    </Link>
  );
}
