import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { PomodoroTimer } from "@/components/tools/pomodoro/pomodoro-timer";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/seo/schema";
import { getToolBySlug } from "@/lib/data/tools";

const tool = getToolBySlug("pomodoro");

export const metadata: Metadata = tool
  ? createMetadata({
      title: tool.title,
      description: tool.description,
      path: "/tools/pomodoro",
    })
  : {};

export default function PomodoroPage() {
  if (!tool) {
    notFound();
  }

  return (
    <>
      <JsonLd data={softwareApplicationSchema(tool)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Tools", path: "/tools" },
          { name: tool.title, path: "/tools/pomodoro" },
        ])}
      />

      <PageHeader
        eyebrow="Tools"
        title={tool.title}
        description="Stays running across reloads — everything is saved to your browser's local storage, not a server."
      />

      <PomodoroTimer />
    </>
  );
}
