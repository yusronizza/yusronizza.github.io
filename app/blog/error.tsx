"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function BlogError({ reset }: RouteErrorPageProps) {
  return (
    <RouteError
      heading="Couldn't load posts"
      description="Blog posts couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
