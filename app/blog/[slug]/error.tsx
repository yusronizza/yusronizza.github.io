"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function BlogPostError({ reset }: RouteErrorPageProps) {
  return (
    <RouteError
      heading="Couldn't load post"
      description="This post couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
