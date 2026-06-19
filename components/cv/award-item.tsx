import type { AwardEntry } from "@/lib/data/profile";

export function AwardItem({ entry }: { entry: AwardEntry }) {
  return (
    <li className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between">
      <div>
        <p className="text-sm">
          {entry.name} &middot; <span className="text-muted">{entry.issuer}</span>
        </p>
        {entry.description && <p className="mt-1 text-sm text-muted">{entry.description}</p>}
      </div>
      <span className="shrink-0 font-mono text-xs text-muted">{entry.year}</span>
    </li>
  );
}
