"use client";

import { RouteError } from "@/components/ui/route-error";

export default function BlogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      heading="Couldn't load posts"
      description="Blog posts couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
