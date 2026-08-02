import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { PomodoroTimer } from "@/components/tools/pomodoro/pomodoro-timer";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/seo/schema";
import { getTool } from "@/lib/api/tools";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tool = await getTool("pomodoro");
    return createMetadata({
      title: tool.title,
      description: tool.description,
      path: "/tools/pomodoro",
    });
  } catch {
    return {};
  }
}

export default async function PomodoroPage() {
  let tool;
  try {
    tool = await getTool("pomodoro");
  } catch {
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
