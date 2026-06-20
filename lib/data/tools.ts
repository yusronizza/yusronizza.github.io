/**
 * Registry of small interactive tools hosted on this site. Each tool is its
 * own hand-built page under app/tools/<slug> — this list only drives the
 * /tools hub page.
 */

export type Tool = {
  slug: string;
  title: string;
  description: string;
};

export const tools: Tool[] = [
  {
    slug: "pomodoro",
    title: "Pomodoro Timer",
    description:
      "A configurable focus timer with auto-cycling breaks, sound and notification alerts, and session stats — all saved in your browser.",
  },
];

export function getAllTools(): Tool[] {
  return tools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
