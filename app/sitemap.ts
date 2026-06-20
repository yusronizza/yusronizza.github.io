import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getAllProjectSlugs } from "@/lib/data/projects";
import { getAllPostSlugs, getPostBySlug } from "@/lib/data/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteConfig.url}/cv`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/tools`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/tools/pomodoro`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjectSlugs().map((slug) => ({
    url: `${siteConfig.url}/projects/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${siteConfig.url}/blog/${slug}`,
    lastModified: getPostBySlug(slug)?.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
