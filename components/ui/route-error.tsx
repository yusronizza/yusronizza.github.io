"use client";

import { Button, LinkButton } from "@/components/ui/button";

export type RouteErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function RouteError({
  heading = "Something went wrong",
  description = "The content couldn't be loaded. The server may be unavailable.",
  reset,
}: {
  heading?: string;
  description?: string;
  reset?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Error</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h1>
      <p className="max-w-md text-muted">{description}</p>
      <div className="flex flex-wrap gap-3">
        {reset && <Button onClick={reset}>Try again</Button>}
        <LinkButton href="/" variant="secondary">
          Back to home
        </LinkButton>
      </div>
    </div>
  );
}
