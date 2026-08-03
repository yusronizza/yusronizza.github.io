import { ToolCardSkeleton } from "@/components/skeletons/card-skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";

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
