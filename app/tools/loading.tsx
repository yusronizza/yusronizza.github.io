import { Skeleton } from "@/components/skeletons/skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";

function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 bg-surface p-6 shadow-sm">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-3/4" />
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="grid gap-4 py-12 sm:grid-cols-2 sm:py-16">
        {Array.from({ length: 2 }).map((_, i) => (
          <ToolCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
