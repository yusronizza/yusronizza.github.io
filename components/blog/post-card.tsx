import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import type { PostSummary } from "@/lib/domain/types";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Card className="relative h-full hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <time dateTime={post.publishedAt} className="text-xs text-muted">
          {formatDate(post.publishedAt)}
        </time>
        <span className="shrink-0 text-xs text-muted">
          {post.readingTimeMinutes} min read
        </span>
      </div>

      {/*
        Title link covers the whole card via ::after so the card is fully clickable.
        Tag links sit above it (relative z-10) so they intercept their own clicks.
      */}
      <h3 className="mt-3 text-lg font-semibold tracking-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 text-sm text-muted">{post.excerpt}</p>

      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="transition-opacity hover:opacity-75"
          >
            <Badge>{tag}</Badge>
          </Link>
        ))}
      </div>
    </Card>
  );
}
