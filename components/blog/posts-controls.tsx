"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LIMIT_OPTIONS, DEFAULT_LIMIT } from "@/lib/blog/pagination";

export function PostsControls({
  initialQ,
  initialLimit,
  initialTag,
}: {
  initialQ: string;
  initialLimit: number;
  initialTag: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(initialQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setInputValue(initialQ);
  }, [initialQ]);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("cursor"); // reset pagination on any filter change
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      return `/blog${qs ? `?${qs}` : ""}`;
    },
    [searchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // search and tag are mutually exclusive (API doesn't support combining them)
        router.replace(buildUrl({ q: value || undefined, tag: undefined }));
      }, 400);
    },
    [router, buildUrl]
  );

  const handleLimitChange = useCallback(
    (n: number) => {
      router.replace(buildUrl({ limit: String(n) }));
    },
    [router, buildUrl]
  );

  const handleClearTag = useCallback(() => {
    router.replace(buildUrl({ tag: undefined }));
  }, [router, buildUrl]);

  const handleClearSearch = useCallback(() => {
    setInputValue("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.replace(buildUrl({ q: undefined }));
  }, [router, buildUrl]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search + limit row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width={15}
            height={15}
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.866 3.342a4.5 4.5 0 1 1 .708-.707l2.761 2.76a.5.5 0 1 1-.707.708l-2.762-2.761Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            placeholder="Search posts…"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleSearchChange(e.target.value);
            }}
            className="h-10 w-full rounded-full border border-border bg-transparent pl-9 pr-9 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
          />
          {inputValue && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Limit selector */}
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-muted">Per page:</span>
          <div className="flex gap-1">
            {LIMIT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleLimitChange(n)}
                className={`h-8 w-9 rounded-full border text-xs font-medium transition-colors ${
                  n === initialLimit
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {(initialTag || (initialQ && !initialTag)) && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Filtering by:</span>
          {initialTag && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              tag: {initialTag}
              <button
                type="button"
                aria-label={`Remove tag filter: ${initialTag}`}
                onClick={handleClearTag}
                className="ml-0.5 hover:opacity-70"
              >
                <svg width={10} height={10} viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l8 8M9 1L1 9"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          )}
          {initialQ && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              &ldquo;{initialQ}&rdquo;
              <button
                type="button"
                aria-label="Clear search filter"
                onClick={handleClearSearch}
                className="ml-0.5 hover:opacity-70"
              >
                <svg width={10} height={10} viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l8 8M9 1L1 9"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
