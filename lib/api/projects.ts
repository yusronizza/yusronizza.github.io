import { cache } from "react";
import { apiFetch, buildUrl } from "./client";
import type { Project, ProjectSummary } from "@/lib/domain/types";

type RawProjectSummary = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  role: string;
  year: number;
  featured: boolean;
  links: { live?: string; repo?: string };
};

type RawProject = RawProjectSummary & {
  long_description: string[];
  highlights: string[];
};

function toProjectSummary(raw: RawProjectSummary): ProjectSummary {
  return {
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    tags: raw.tags,
    role: raw.role,
    year: raw.year,
    featured: raw.featured,
    links: raw.links ?? {},
  };
}

function toProject(raw: RawProject): Project {
  return {
    ...toProjectSummary(raw),
    longDescription: raw.long_description ?? [],
    highlights: raw.highlights ?? [],
  };
}

export type ProjectsParams = {
  featured?: boolean;
  tag?: string;
};

export async function getProjects(params?: ProjectsParams): Promise<ProjectSummary[]> {
  const qs = new URLSearchParams();
  if (params?.featured) qs.set("featured", "true");
  if (params?.tag) qs.set("tag", params.tag);

  const res = await apiFetch<{ data: RawProjectSummary[] }>(buildUrl("/projects", qs));
  return res.data.map(toProjectSummary);
}

export const getProject = cache(async (slug: string): Promise<Project> => {
  const res = await apiFetch<{ data: RawProject }>(`/projects/${slug}`);
  return toProject(res.data);
});
