import { apiFetch } from "./client";
import type { Tool } from "@/lib/domain/types";

export async function getTools(): Promise<Tool[]> {
  const res = await apiFetch<{ data: Tool[] }>("/tools");
  return res.data;
}

export async function getTool(slug: string): Promise<Tool> {
  const res = await apiFetch<{ data: Tool }>(`/tools/${slug}`);
  return res.data;
}
