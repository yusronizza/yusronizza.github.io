import Link from "next/link";
import { Section } from "@/components/ui/section";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/data/posts";

export function RecentPosts() {
  const recent = getAllPosts().slice(0, 3);

  return (
    <Section title="Recent writing" index={3} className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Link
        href="/blog"
        className="mt-6 inline-block font-mono text-sm text-accent hover:underline"
      >
        [read all posts &rarr;]
      </Link>
    </Section>
  );
}
