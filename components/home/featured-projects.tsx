import Link from "next/link";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/projects/project-card";
import { getFeaturedProjects } from "@/lib/data/projects";

export function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <Section title="Featured projects" className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <Link
        href="/projects"
        className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
      >
        View all projects &rarr;
      </Link>
    </Section>
  );
}
