import Link from "next/link";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/lib/api/projects";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";

export async function FeaturedProjects({ lang }: { lang: Lang }) {
  const t = getDictionary(lang).home;
  let featured;
  try {
    featured = await getProjects({ featured: true, lang });
  } catch {
    return (
      <Section title={t.featuredProjects} index={2} className="border-t border-border">
        <p className="text-sm text-muted">{t.projectsUnavailable}</p>
      </Section>
    );
  }

  return (
    <Section title={t.featuredProjects} index={2} className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} lang={lang} />
        ))}
      </div>
      <Link
        href={localePath(lang, "/projects")}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        {t.viewAllProjects} &rarr;
      </Link>
    </Section>
  );
}
