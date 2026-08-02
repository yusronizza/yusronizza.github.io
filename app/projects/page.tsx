import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getProjects } from "@/lib/api/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Projects",
  description: "A selection of products, tools and experiments I've built.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Projects", path: "/projects" }])} />
      <PageHeader
        eyebrow="Projects"
        title="Things I've built"
        description="A mix of client work, open-source tools and personal experiments."
      />
      <div className="grid gap-4 py-12 sm:grid-cols-2 sm:py-16">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
