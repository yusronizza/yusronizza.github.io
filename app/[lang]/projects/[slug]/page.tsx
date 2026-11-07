import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, projectSchema } from "@/lib/seo/schema";
import { getProject } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { getDictionary } from "@/lib/i18n";
import { resolveLang, type LangSlugParams } from "@/lib/i18n/params";

// Rendered on first request, then cached (ISR) until the API revalidates the
// "projects" tag or an hour passes.
export const revalidate = 3600;
// No slugs are generated at build time; each is rendered on first request.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: LangSlugParams): Promise<Metadata> {
  const [{ slug }, lang] = await Promise.all([params, resolveLang(params)]);
  try {
    const project = await getProject(slug, lang);
    return createMetadata({
      lang,
      title: project.title,
      description: project.description,
      path: `/projects/${project.slug}`,
      availableLangs: project.availableLocales,
    });
  } catch {
    return {};
  }
}

export default async function ProjectPage({ params }: LangSlugParams) {
  const [{ slug }, lang] = await Promise.all([params, resolveLang(params)]);
  const t = getDictionary(lang);
  let project;
  try {
    project = await getProject(slug, lang);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <JsonLd data={projectSchema(project, lang)} />
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: t.nav.projects, path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={`${project.role} · ${project.year}`}
        title={project.title}
        description={project.description}
        actions={
          project.links.live || project.links.repo ? (
            <>
              {project.links.live && (
                <LinkButton href={project.links.live} external>
                  {t.projects.liveSite}
                </LinkButton>
              )}
              {project.links.repo && (
                <LinkButton href={project.links.repo} variant="secondary" external>
                  {t.projects.source}
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
      {project.highlights.length > 0 && (
        <Section title={t.projects.highlights} index={1} className="border-t border-border">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
