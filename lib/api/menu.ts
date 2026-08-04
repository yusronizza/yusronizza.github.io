import { apiFetch } from "./client";
import type { MenuItem } from "@/lib/domain/types";

type RawMenuItem = {
  id: number;
  group: "public" | "admin";
  parent_id: number | null;
  section: string;
  label: string;
  path: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  children?: RawMenuItem[];
};

function toMenuItem(raw: RawMenuItem): MenuItem {
  return {
    id: raw.id,
    group: raw.group,
    parentId: raw.parent_id,
    section: raw.section,
    label: raw.label,
    path: raw.path,
    icon: raw.icon,
    sortOrder: raw.sort_order,
    isVisible: raw.is_visible,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    ...(raw.children?.length ? { children: raw.children.map(toMenuItem) } : {}),
  };
}

export async function getMenu(): Promise<MenuItem[]> {
  const res = await apiFetch<{ data: RawMenuItem[] }>("/public/menu");
  return res.data.map(toMenuItem);
}
