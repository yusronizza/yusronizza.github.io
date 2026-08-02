"use client";

import { RouteError } from "@/components/ui/route-error";

export default function AboutError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      heading="Couldn't load profile"
      description="Profile data couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
