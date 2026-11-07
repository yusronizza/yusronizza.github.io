import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectSummary } from "@/lib/domain/types";

import { localePath, type Lang } from "@/lib/i18n";

export function ProjectCard({ project, lang }: { project: ProjectSummary; lang: Lang }) {
  return (
    <Link href={localePath(lang, `/projects/${project.slug}`)} className="block">
      <Card className="h-full hover:shadow-md">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          <span className="shrink-0 text-xs text-muted">{project.year}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
