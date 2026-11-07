"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function SectionError({ reset }: RouteErrorPageProps) {
  return <RouteError reset={reset} />;
}
