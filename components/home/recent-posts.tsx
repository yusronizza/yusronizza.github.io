import Link from "next/link";
import { Section } from "@/components/ui/section";
import { PostCard } from "@/components/blog/post-card";
import { getPosts } from "@/lib/api/posts";

export async function RecentPosts() {
  let posts;
  try {
    const result = await getPosts({ limit: 3 });
    posts = result.posts;
  } catch {
    return (
      <Section title="Recent writing" index={3} className="border-t border-border">
        <p className="text-sm text-muted">Posts couldn&apos;t be loaded right now.</p>
      </Section>
    );
  }

  return (
    <Section title="Recent writing" index={3} className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Link
        href="/blog"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        Read all posts &rarr;
      </Link>
    </Section>
  );
}
