"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function AboutError({ reset }: RouteErrorPageProps) {
  return (
    <RouteError
      heading="Couldn't load profile"
      description="Profile data couldn't be fetched. The server may be unavailable — please try again shortly."
      reset={reset}
    />
  );
}
