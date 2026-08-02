import Link from "next/link";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/lib/api/projects";

export async function FeaturedProjects() {
  let featured;
  try {
    featured = await getProjects({ featured: true });
  } catch {
    return (
      <Section title="Featured projects" index={2} className="border-t border-border">
        <p className="text-sm text-muted">Projects couldn&apos;t be loaded right now.</p>
      </Section>
    );
  }

  return (
    <Section title="Featured projects" index={2} className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <Link
        href="/projects"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        View all projects &rarr;
      </Link>
    </Section>
  );
}
