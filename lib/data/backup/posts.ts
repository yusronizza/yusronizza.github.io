/**
 * Blog posts are authored as markdown files in content/blog/<slug>.md with
 * YAML frontmatter. This module reads and parses them at build time —
 * add a new .md file there to publish a post.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { estimateReadingTime } from "@/lib/utils/reading-time";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
};

type PostFrontmatter = {
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
};

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "blog");

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIRECTORY, fileName), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    tags: frontmatter.tags,
    publishedAt: frontmatter.publishedAt,
    content: content.trim(),
    readingTimeMinutes: estimateReadingTime(content),
  };
}

function getPostFileNames(): string[] {
  return fs.readdirSync(POSTS_DIRECTORY).filter((name) => name.endsWith(".md"));
}

export function getAllPosts(): Post[] {
  return getPostFileNames()
    .map(readPostFile)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  const fileName = `${slug}.md`;
  if (!fs.existsSync(path.join(POSTS_DIRECTORY, fileName))) return undefined;
  return readPostFile(fileName);
}

export function getAllPostSlugs(): string[] {
  return getPostFileNames().map((name) => name.replace(/\.md$/, ""));
}
