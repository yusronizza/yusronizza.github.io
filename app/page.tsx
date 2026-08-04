import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Interests } from "@/components/home/interests";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { RecentPosts } from "@/components/home/recent-posts";
import { Connect } from "@/components/home/connect";
import { ServerStatus } from "@/components/home/server-status";
import { FadeIn } from "@/components/ui/fade-in";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  path: "/",
  isRoot: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FadeIn><Interests /></FadeIn>
      <FadeIn><FeaturedProjects /></FadeIn>
      <FadeIn><RecentPosts /></FadeIn>
      <FadeIn><Connect /></FadeIn>
      <FadeIn><ServerStatus /></FadeIn>
    </>
  );
}
