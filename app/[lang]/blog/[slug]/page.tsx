import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { getPost } from "@/lib/api/posts";
import { ApiError } from "@/lib/api/client";
import { getDictionary } from "@/lib/i18n";
import { resolveLang, type LangSlugParams } from "@/lib/i18n/params";
import { formatDate } from "@/lib/utils/format";

// Rendered on first request, then cached (ISR) until the API revalidates the
// "posts" tag or an hour passes.
export const revalidate = 3600;
// No slugs are generated at build time; each is rendered on first request.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: LangSlugParams): Promise<Metadata> {
  const [{ slug }, lang] = await Promise.all([params, resolveLang(params)]);
  try {
    // Same language as the body, so titles and descriptions match the page.
    const post = await getPost(slug, lang);
    return createMetadata({
      lang,
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
      imageUrl: post.coverImageUrl || undefined,
      availableLangs: post.availableLocales,
    });
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: LangSlugParams) {
  const [{ slug }, lang] = await Promise.all([params, resolveLang(params)]);
  const t = getDictionary(lang);
  let post;
  try {
    post = await getPost(slug, lang);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <JsonLd data={blogPostingSchema(post, lang)} />
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: t.nav.blog, path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <article lang={post.locale || lang}>
        <PageHeader
          eyebrow={`${formatDate(post.publishedAt, lang)} · ${t.common.minRead(post.readingTimeMinutes)}`}
          title={post.title}
          description={post.excerpt}
        />
        <Section>
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          {/* HTML rendered by the API's Markdown renderer, which strips raw HTML. */}
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </Section>
      </article>
    </>
  );
}
