"use client";

import { useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import type { ShortLink } from "@/lib/domain/types";
import { siteConfig } from "@/lib/config/site";

const SECONDS = 5;
const R = 44;
const C = 2 * Math.PI * R;

function formatTs(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RedirectCountdown({ link }: { link: ShortLink }) {
  const [remaining, setRemaining] = useState(SECONDS);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (cancelled) return;
    if (remaining <= 0) {
      window.location.href = link.targetUrl;
      return;
    }
    const id = setTimeout(() => setRemaining((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, cancelled, link.targetUrl]);

  const dashOffset = C * (1 - remaining / SECONDS);

  const details: { label: string; value: string; mono?: boolean }[] = [
    { label: "Short URL", value: `${siteConfig.url}/l/${link.code}`, mono: true },
    { label: "Destination", value: link.targetUrl, mono: true },
    { label: "Total clicks", value: String(link.clickCount) },
    { label: "Created", value: formatTs(link.createdAt) },
    ...(link.expiresAt ? [{ label: "Expires", value: formatTs(link.expiresAt) }] : []),
    ...(link.lastClickedAt ? [{ label: "Last visited", value: formatTs(link.lastClickedAt) }] : []),
  ];

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-border">
        <div
          className="h-full bg-accent"
          style={{
            width: cancelled ? "0%" : `${(remaining / SECONDS) * 100}%`,
            transition: cancelled ? "none" : "width 1s linear",
          }}
        />
      </div>

      <section className="py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Short link &middot; /{link.code}
        </p>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
          {/* Countdown ring */}
          <div className="relative flex shrink-0 items-center justify-center">
            <svg className="-rotate-90" width={120} height={120} aria-hidden="true">
              <circle
                cx={60}
                cy={60}
                r={R}
                stroke="currentColor"
                strokeWidth={4}
                fill="none"
                className="text-border"
              />
              <circle
                cx={60}
                cy={60}
                r={R}
                stroke="currentColor"
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                className={cancelled ? "text-muted" : "text-accent"}
                strokeDasharray={C}
                strokeDashoffset={dashOffset}
                style={{ transition: cancelled ? "none" : "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="absolute font-mono text-3xl font-bold tabular-nums">
              {cancelled ? "✕" : remaining <= 0 ? "→" : remaining}
            </span>
          </div>

          {/* Status + destination */}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {cancelled
                ? "Redirect cancelled"
                : remaining <= 0
                ? "Redirecting…"
                : `Redirecting in ${remaining} second${remaining !== 1 ? "s" : ""}`}
            </h1>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted">
              Destination
            </p>
            <a
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all font-mono text-sm text-accent hover:underline"
            >
              {link.targetUrl}
            </a>

            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={link.targetUrl} external>
                Go now
              </LinkButton>
              {cancelled ? (
                <LinkButton href="/" variant="secondary">
                  Go home
                </LinkButton>
              ) : (
                <Button variant="secondary" onClick={() => setCancelled(true)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Details table */}
        <div className="mt-14 border-t border-border pt-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
            Link details
          </p>
          <div className="space-y-3 text-sm">
            {details.map(({ label, value, mono }) => (
              <div key={label} className="flex gap-4">
                <span className="w-28 shrink-0 text-muted">{label}</span>
                <span className={`break-all ${mono ? "font-mono text-xs leading-relaxed" : ""}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
