import Link from "next/link";
import { Section } from "@/components/ui/section";
import { PostCard } from "@/components/blog/post-card";
import { getPosts } from "@/lib/api/posts";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";

const RECENT_POSTS_LIMIT = 3;

export async function RecentPosts({ lang }: { lang: Lang }) {
  const t = getDictionary(lang).home;
  let posts;
  try {
    ({ data: posts } = await getPosts({ limit: RECENT_POSTS_LIMIT, lang }));
  } catch {
    return (
      <Section title={t.recentWriting} index={3} className="border-t border-border">
        <p className="text-sm text-muted">{t.postsUnavailable}</p>
      </Section>
    );
  }

  return (
    <Section title={t.recentWriting} index={3} className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang={lang} />
        ))}
      </div>
      <Link
        href={localePath(lang, "/blog")}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        {t.readAllPosts} &rarr;
      </Link>
    </Section>
  );
}
