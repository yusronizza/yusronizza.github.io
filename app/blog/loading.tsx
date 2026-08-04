import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";
import { PostCardSkeleton } from "@/components/skeletons/card-skeleton";
import { Skeleton } from "@/components/skeletons/skeleton";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />

      {/* Controls skeleton */}
      <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <Skeleton className="h-10 w-full max-w-sm rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-9 rounded-full" />
          <Skeleton className="h-8 w-9 rounded-full" />
          <Skeleton className="h-8 w-9 rounded-full" />
        </div>
      </div>

      <div className="grid gap-4 pb-12 sm:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pb-12 pt-6">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>
    </>
  );
}
