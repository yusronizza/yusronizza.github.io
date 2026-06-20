import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import type { Post } from "@/lib/data/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card label={`~/blog/${post.slug}`} className="h-full hover:border-accent">
        <div className="flex items-center justify-between gap-4">
          <time dateTime={post.publishedAt} className="font-mono text-xs text-muted">
            {formatDate(post.publishedAt)}
          </time>
          <span className="shrink-0 font-mono text-xs text-muted">
            {post.readingTimeMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight">{post.title}</h3>
        <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
