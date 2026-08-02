import { Skeleton } from "@/components/skeletons/skeleton";
import { PostCardSkeleton } from "@/components/skeletons/card-skeleton";
import { ProjectCardSkeleton } from "@/components/skeletons/card-skeleton";
import { InterestCardSkeleton } from "@/components/skeletons/card-skeleton";

export default function Loading() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-32">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="mt-4 h-14 w-full max-w-xl" />
        <Skeleton className="mt-2 h-14 w-3/4 max-w-xl" />
        <Skeleton className="mt-6 h-5 w-full max-w-lg" />
        <Skeleton className="mt-2 h-5 w-4/5 max-w-lg" />
        <div className="mt-10 flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </section>

      {/* Interests */}
      <section className="border-t border-border/60 py-14 sm:py-20">
        <Skeleton className="mb-10 h-8 w-28" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <InterestCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-t border-border/60 py-14 sm:py-20">
        <Skeleton className="mb-10 h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Recent Writing */}
      <section className="border-t border-border/60 py-14 sm:py-20">
        <Skeleton className="mb-10 h-8 w-44" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}
