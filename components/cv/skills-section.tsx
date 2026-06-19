import { Badge } from "@/components/ui/badge";
import type { SkillGroup } from "@/lib/data/profile";

export function SkillsSection({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
            {group.category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
