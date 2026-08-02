import { Skeleton } from "@/components/skeletons/skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";

function ExperienceItemSkeleton() {
  return (
    <div className="border-b border-border py-6 first:pt-0 last:border-b-0">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="mt-2 h-3 w-40" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <section className="py-14 sm:py-20">
        <Skeleton className="mb-10 h-8 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <ExperienceItemSkeleton key={i} />
        ))}
      </section>
      <section className="border-t border-border/60 py-14 sm:py-20">
        <Skeleton className="mb-10 h-8 w-28" />
        {Array.from({ length: 2 }).map((_, i) => (
          <ExperienceItemSkeleton key={i} />
        ))}
      </section>
    </>
  );
}
