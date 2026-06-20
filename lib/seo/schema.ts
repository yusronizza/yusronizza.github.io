import { siteConfig } from "@/lib/config/site";
import type { Post } from "@/lib/data/posts";
import type { Project } from "@/lib/data/projects";
import type { Profile } from "@/lib/data/profile";
import type { Tool } from "@/lib/data/tools";

export function personSchema(profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: siteConfig.url,
    email: siteConfig.author.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function blogPostingSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    url: `${siteConfig.url}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };
}

export function projectSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    url: `${siteConfig.url}/projects/${project.slug}`,
    keywords: project.tags.join(", "),
  };
}

export function softwareApplicationSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
