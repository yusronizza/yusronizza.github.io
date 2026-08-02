"use client";

import { RouteError } from "@/components/ui/route-error";

export default function ToolsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      heading="Couldn't load tools"
      description="Tools couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
