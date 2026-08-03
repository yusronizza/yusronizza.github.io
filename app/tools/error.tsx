"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function ToolsError({ reset }: RouteErrorPageProps) {
  return (
    <RouteError
      heading="Couldn't load tools"
      description="Tools couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
