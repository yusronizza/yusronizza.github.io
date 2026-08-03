import { cache } from "react";
import { apiFetch } from "./client";
import type { Tool } from "@/lib/domain/types";

export async function getTools(): Promise<Tool[]> {
  const res = await apiFetch<{ data: Tool[] }>("/tools");
  return res.data;
}

export const getTool = cache(async (slug: string): Promise<Tool> => {
  const res = await apiFetch<{ data: Tool }>(`/tools/${slug}`);
  return res.data;
});
