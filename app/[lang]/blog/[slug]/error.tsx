"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function DetailError({ reset }: RouteErrorPageProps) {
  return <RouteError section="blog" reset={reset} />;
}
