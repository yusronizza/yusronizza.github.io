import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PostCard } from "@/components/blog/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getAllPosts } from "@/lib/data/posts";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Notes on software engineering, architecture and building things.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }])} />
      <PageHeader
        eyebrow="Blog"
        title="Writing"
        description="Notes on software engineering, architecture and building things."
      />
      <div className="py-12 sm:py-16">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
