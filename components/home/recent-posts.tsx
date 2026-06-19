import Link from "next/link";
import { Section } from "@/components/ui/section";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/data/posts";

export function RecentPosts() {
  const recent = getAllPosts().slice(0, 3);

  return (
    <Section title="Recent writing" className="border-t border-border">
      <div>
        {recent.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Link
        href="/blog"
        className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
      >
        Read all posts &rarr;
      </Link>
    </Section>
  );
}
