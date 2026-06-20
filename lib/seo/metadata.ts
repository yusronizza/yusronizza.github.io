import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

type CreateMetadataOptions = {
  title: string;
  description: string;
  path: string;
  /** Set true for the homepage so the title isn't run through the template. */
  isRoot?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
};

export function createMetadata({
  title,
  description,
  path,
  isRoot = false,
  type = "website",
  publishedTime,
  tags,
}: CreateMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const resolvedTitle = isRoot ? title : `${title} | ${siteConfig.shortName}`;

  return {
    // For the homepage we omit `title` so the layout's `default` is used,
    // avoiding the template being applied twice. Every other page sets a
    // short title and lets the root layout's template append the suffix.
    ...(isRoot ? {} : { title }),
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && tags ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
    },
  };
}
