import { cache } from "react";
import { apiFetch } from "./client";
import type { ShortLink } from "@/lib/domain/types";

type RawShortLink = {
  code: string;
  target_url: string;
  click_count: number;
  expires_at: string | null;
  is_active: boolean;
  last_clicked_at: string | null;
  created_at: string;
  updated_at: string;
};

function toShortLink(raw: RawShortLink): ShortLink {
  return {
    code: raw.code,
    targetUrl: raw.target_url,
    clickCount: raw.click_count,
    expiresAt: raw.expires_at,
    isActive: raw.is_active,
    lastClickedAt: raw.last_clicked_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const resolveLink = cache(async (code: string): Promise<ShortLink> => {
  const res = await apiFetch<{ data: RawShortLink }>(`/public/links/${code}`);
  return toShortLink(res.data);
});
