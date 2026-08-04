import { cache } from "react";
import { apiFetch, buildUrl } from "./client";
import type { PaginationMeta, Post, PostSummary } from "@/lib/domain/types";

type RawPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  published_at: string;
  reading_time_minutes: number;
  status: string;
  cover_image_url: string;
};

type RawPost = RawPostSummary & {
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
    status: raw.status as PostSummary["status"],
    coverImageUrl: raw.cover_image_url,
  };
}

function toPost(raw: RawPost): Post {
  return {
    ...toPostSummary(raw),
    contentHtml: raw.content_html,
  };
}

function toMeta(raw: RawMeta): PaginationMeta {
  return {
    total: raw.total,
    limit: raw.limit,
    nextCursor: raw.next_cursor,
    prevCursor: raw.prev_cursor,
  };
}

export type PostsParams = {
  limit?: number;
  cursor?: string;
  tag?: string;
  sort?: string;
  status?: string;
};

export type PostsPage = {
  data: PostSummary[];
  meta: PaginationMeta;
};

export async function getPosts(params?: PostsParams): Promise<PostsPage> {
  const qs = new URLSearchParams();
  if (params?.limit !== undefined) qs.set("limit", String(params.limit));
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.tag) qs.set("tag", params.tag);
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.status) qs.set("status", params.status);

  const res = await apiFetch<{ data: RawPostSummary[]; meta: RawMeta }>(buildUrl("/public/posts", qs));
  return { data: res.data.map(toPostSummary), meta: toMeta(res.meta) };
}

export const getPost = cache(async (slug: string): Promise<Post> => {
  const res = await apiFetch<{ data: RawPost }>(`/public/posts/${slug}`);
  return toPost(res.data);
});

export type SearchPostsParams = {
  q: string;
  limit?: number;
  cursor?: string;
};

export async function searchPosts(params: SearchPostsParams): Promise<PostsPage> {
  const qs = new URLSearchParams();
  qs.set("q", params.q);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);

  const res = await apiFetch<{ data: RawPostSummary[]; meta: RawMeta }>(
    buildUrl("/public/posts/search", qs)
  );
  return { data: res.data.map(toPostSummary), meta: toMeta(res.meta) };
}

