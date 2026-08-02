import { Skeleton } from "@/components/skeletons/skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <section className="border-t border-border/60 py-14 sm:py-20">
        <Skeleton className="mb-10 h-8 w-28" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-32" />
          ))}
        </div>
      </section>
      <section className="border-t border-border/60 py-14 sm:py-20">
        <Skeleton className="mb-10 h-8 w-24" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-28" />
          ))}
        </div>
      </section>
    </>
  );
}
