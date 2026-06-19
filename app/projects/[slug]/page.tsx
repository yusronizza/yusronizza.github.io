import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, projectSchema } from "@/lib/seo/schema";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return createMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const hasLinks = Boolean(project.links.live || project.links.repo);

  return (
    <>
      <JsonLd data={projectSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />

      <PageHeader
        eyebrow={`${project.role} · ${project.year}`}
        title={project.title}
        description={project.description}
        actions={
          hasLinks ? (
            <>
              {project.links.live && (
                <LinkButton href={project.links.live} external>
                  Live site
                </LinkButton>
              )}
              {project.links.repo && (
                <LinkButton href={project.links.repo} variant="secondary" external>
                  Source
                </LinkButton>
              )}
            </>
          ) : undefined
        }
      />

      <Section>
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="space-y-4 text-base leading-relaxed">
          {project.longDescription.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title="Highlights" className="border-t border-border">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </Section>
    </>
  );
}
