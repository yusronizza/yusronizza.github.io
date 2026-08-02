"use client";

import { RouteError } from "@/components/ui/route-error";

export default function ProjectError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      heading="Couldn't load project"
      description="This project couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
