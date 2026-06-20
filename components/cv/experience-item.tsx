import { formatMonthYear } from "@/lib/utils/format";
import type { ExperienceEntry } from "@/lib/data/profile";

export function ExperienceItem({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className="border-b border-border py-6 first:pt-0 last:border-b-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-semibold tracking-tight">
          {entry.role} &middot; {entry.organization}
        </h3>
        <p className="shrink-0 font-mono text-xs text-muted">
          {formatMonthYear(entry.startDate)} &ndash; {formatMonthYear(entry.endDate)}
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">{entry.location}</p>
      {entry.summary && <p className="mt-3 text-sm">{entry.summary}</p>}
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
        {entry.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </article>
  );
}
