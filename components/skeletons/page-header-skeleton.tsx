import { Skeleton } from "./skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-border/60 py-14 sm:py-20">
      <Skeleton className="h-3 w-32 mb-4" />
      <Skeleton className="h-12 w-64 sm:w-80" />
      <Skeleton className="mt-4 h-4 w-full max-w-md" />
      <Skeleton className="mt-1.5 h-4 w-3/4 max-w-xs" />
    </div>
  );
}

