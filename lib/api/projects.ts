import type { Project } from "@/lib/data/projects";
import { apiGet, apiGetList } from "./client";

export const projectsApi = {
  list: (params?: { featured?: boolean; tag?: string }) => {
    const qs = new URLSearchParams();
    if (params?.featured) qs.set("featured", "true");
    if (params?.tag) qs.set("tag", params.tag);
    const query = qs.toString() ? `?${qs}` : "";
    return apiGetList<Project>(`/projects${query}`);
  },
  get: (slug: string) => apiGet<Project>(`/projects/${slug}`),
};
