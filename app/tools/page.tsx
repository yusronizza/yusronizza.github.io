import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ToolCard } from "@/components/tools/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getAllTools } from "@/lib/data/tools";

export const metadata: Metadata = createMetadata({
  title: "Tools",
  description: "Small interactive tools, built for fun and useful enough to keep around.",
  path: "/tools",
});

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Tools", path: "/tools" }])} />
      <PageHeader
        eyebrow="Tools"
        title="Small tools"
        description="Interactive tools that run entirely in your browser — nothing is sent to a server."
      />
      <div className="grid gap-4 py-12 sm:grid-cols-2 sm:py-16">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </>
  );
}
