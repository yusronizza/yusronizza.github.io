"use client";

import { RouteError, type RouteErrorPageProps } from "@/components/ui/route-error";

export default function ContactError({ reset }: RouteErrorPageProps) {
  return <RouteError heading="Contact unavailable" reset={reset} />;
}
