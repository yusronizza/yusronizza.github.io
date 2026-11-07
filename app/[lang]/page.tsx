import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Interests } from "@/components/home/interests";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { RecentPosts } from "@/components/home/recent-posts";
import { Connect } from "@/components/home/connect";
import { ServerStatus } from "@/components/home/server-status";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";
import { resolveLang, type LangParams } from "@/lib/i18n/params";

// Static per language, refreshed hourly or on demand via /api/revalidate.
// The status section has its own one-minute cache.
export const revalidate = 3600;

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return createMetadata({ lang: await resolveLang(params), title: siteConfig.defaultTitle, description: siteConfig.description, path: "/", isRoot: true });
}

export default async function HomePage({ params }: LangParams) {
  const lang = await resolveLang(params);
  return (
    <>
      <Hero lang={lang} />
      <div className="reveal"><Interests lang={lang} /></div>
      <div className="reveal"><FeaturedProjects lang={lang} /></div>
      <div className="reveal"><RecentPosts lang={lang} /></div>
      <div className="reveal"><Connect lang={lang} /></div>
      <div className="reveal"><ServerStatus lang={lang} /></div>
    </>
  );
}
