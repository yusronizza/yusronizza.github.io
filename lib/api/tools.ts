import type { Tool } from "@/lib/data/tools";
import { apiGet, apiGetList } from "./client";

export const toolsApi = {
  list: () => apiGetList<Tool>("/tools"),
  get: (slug: string) => apiGet<Tool>(`/tools/${slug}`),
};
