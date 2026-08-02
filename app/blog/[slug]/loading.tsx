import { Skeleton } from "@/components/skeletons/skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <section className="py-14 sm:py-20">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
          ))}
          <Skeleton className="mt-6 h-6 w-56" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`p2-${i}`} className={`h-4 ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      </section>
    </>
  );
}
