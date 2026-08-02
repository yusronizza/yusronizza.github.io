import type { Post } from "@/lib/data/posts";
import { apiGet, apiGetList } from "./client";

export type PostSummary = Omit<Post, "content">;
export type TagCount = { tag: string; count: number };

export const postsApi = {
  list: (params?: { tag?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.tag) qs.set("tag", params.tag);
    if (params?.limit) qs.set("limit", String(params.limit));
    const query = qs.toString() ? `?${qs}` : "";
    return apiGetList<PostSummary>(`/posts${query}`);
  },
  get: (slug: string) => apiGet<Post>(`/posts/${slug}`),
  tags: () => apiGetList<TagCount>("/posts/tags"),
};
