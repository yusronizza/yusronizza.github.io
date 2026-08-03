import { cache } from "react";
import { apiFetch, buildUrl } from "./client";
import type { Post, PostList, PostSummary, TagCount } from "@/lib/domain/types";

type RawPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  published_at: string;
  reading_time_minutes: number;
};

type RawPost = RawPostSummary & {
  content: string;
  content_html: string;
};

type RawMeta = {
  total: number;
  limit: number;
  next_cursor: string | null;
  prev_cursor: string | null;
};

function toPostSummary(raw: RawPostSummary): PostSummary {
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    tags: raw.tags,
    publishedAt: raw.published_at,
    readingTimeMinutes: raw.reading_time_minutes,
  };
}

function toPost(raw: RawPost): Post {
  return {
    ...toPostSummary(raw),
    content: raw.content,
  };
}

export type PostsParams = {
  limit?: number;
  cursor?: string;
  tag?: string;
};

export async function getPosts(params?: PostsParams): Promise<PostList> {
  const qs = new URLSearchParams();
  if (params?.limit !== undefined) qs.set("limit", String(params.limit));
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.tag) qs.set("tag", params.tag);

  const res = await apiFetch<{ data: RawPostSummary[]; meta: RawMeta }>(buildUrl("/posts", qs));

  return {
    posts: res.data.map(toPostSummary),
    meta: {
      total: res.meta.total,
      limit: res.meta.limit,
      nextCursor: res.meta.next_cursor,
      prevCursor: res.meta.prev_cursor,
    },
  };
}

export const getPost = cache(async (slug: string): Promise<Post> => {
  const res = await apiFetch<{ data: RawPost }>(`/posts/${slug}`);
  return toPost(res.data);
});

export async function getTags(): Promise<TagCount[]> {
  const res = await apiFetch<{ data: TagCount[] }>("/posts/tags");
  return res.data;
}
