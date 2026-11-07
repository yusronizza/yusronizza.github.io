import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getProjects } from "@/lib/api/projects";
import { getDictionary } from "@/lib/i18n";
import { resolveLang, type LangParams } from "@/lib/i18n/params";

export const revalidate = 3600;

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await resolveLang(params);
  const t = getDictionary(lang).projects;
  return createMetadata({ lang, title: t.eyebrow, description: t.metaDescription, path: "/projects" });
}

export default async function ProjectsPage({ params }: LangParams) {
  const lang = await resolveLang(params);
  const t = getDictionary(lang).projects;
  const projects = await getProjects({ lang });

  return (
    <>
      <JsonLd data={breadcrumbSchema(lang, [{ name: t.eyebrow, path: "/projects" }])} />
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />
      <div className="grid gap-4 py-12 sm:grid-cols-2 sm:py-16">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} lang={lang} />
        ))}
      </div>
    </>
  );
}
