import { Skeleton } from "@/components/skeletons/skeleton";

export default function Loading() {
  return (
    <section className="py-16 sm:py-24">
      <Skeleton className="h-3 w-36" />

      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
        <Skeleton className="h-[120px] w-[120px] shrink-0 rounded-full" />

        <div className="min-w-0 flex-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="mt-5 h-3 w-24" />
          <Skeleton className="mt-2 h-4 w-full max-w-sm" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-border pt-8">
        <Skeleton className="mb-5 h-3 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-4 w-28 shrink-0" />
              <Skeleton className="h-4 w-full max-w-xs" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
