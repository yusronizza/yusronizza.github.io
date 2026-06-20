import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Interests } from "@/components/home/interests";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { RecentPosts } from "@/components/home/recent-posts";
import { Connect } from "@/components/home/connect";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { personSchema } from "@/lib/seo/schema";
import { profile } from "@/lib/data/profile";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = createMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  path: "/",
  isRoot: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={personSchema(profile)} />
      <Hero />
      <Interests />
      <FeaturedProjects />
      <RecentPosts />
      <Connect />
    </>
  );
}
