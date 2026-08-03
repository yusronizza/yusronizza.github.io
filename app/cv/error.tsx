"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function CvError({ reset }: RouteErrorPageProps) {
  return (
    <RouteError
      heading="Couldn't load CV"
      description="CV data couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
