import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Tool } from "@/lib/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      <Card label={`~/tools/${tool.slug}`} className="h-full hover:border-accent">
        <h3 className="text-lg font-semibold tracking-tight">{tool.title}</h3>
        <p className="mt-2 text-sm text-muted">{tool.description}</p>
      </Card>
    </Link>
  );
}
