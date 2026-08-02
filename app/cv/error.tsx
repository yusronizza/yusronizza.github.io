"use client";

import { RouteError } from "@/components/ui/route-error";

export default function CvError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      heading="Couldn't load CV"
      description="CV data couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
