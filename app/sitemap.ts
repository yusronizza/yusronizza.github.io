import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getProjects } from "@/lib/api/projects";
import { getPosts } from "@/lib/api/posts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteConfig.url}/cv`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const [projectsResult, postsResult] = await Promise.allSettled([
    getProjects(),
    getPosts({ limit: 100 }),
  ]);

  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const posts = postsResult.status === "fulfilled" ? postsResult.value.data : [];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
