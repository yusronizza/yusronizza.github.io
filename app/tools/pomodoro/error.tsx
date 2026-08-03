"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function PomodoroError({ reset }: RouteErrorPageProps) {
  return (
    <RouteError
      heading="Couldn't load tool"
      description="This tool's data couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
