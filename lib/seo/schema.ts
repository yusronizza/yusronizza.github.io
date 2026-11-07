import { siteConfig } from "@/lib/config/site";
import { HREFLANG, localePath, type Lang } from "@/lib/i18n";
import type { PostSummary, ProjectSummary, Profile } from "@/lib/domain/types";

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

export function blogPostingSchema(post: PostSummary, lang: Lang) {
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
    url: `${siteConfig.url}${localePath(lang, `/blog/${post.slug}`)}`,
    inLanguage: HREFLANG[lang],
    keywords: post.tags.join(", "),
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
  };
}

export function projectSchema(project: ProjectSummary, lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    url: `${siteConfig.url}${localePath(lang, `/projects/${project.slug}`)}`,
    inLanguage: HREFLANG[lang],
    keywords: project.tags.join(", "),
  };
}

export function breadcrumbSchema(lang: Lang, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${localePath(lang, item.path)}`,
    })),
  };
}
