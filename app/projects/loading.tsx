import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";
import { ProjectCardSkeleton } from "@/components/skeletons/card-skeleton";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="grid gap-4 py-12 sm:grid-cols-2 sm:py-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
