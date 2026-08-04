"use client";

import { useEffect, useRef, useState } from "react";
import { useServerStatus } from "@/lib/hooks/use-server-status";

export function ServerOfflineModal() {
  const { status, recheck } = useServerStatus();
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const retryBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status === "offline") setOpen(true);
    if (status === "online") setOpen(false);
  }, [status]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    retryBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="srv-modal-title"
      aria-describedby="srv-modal-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600 dark:text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h2 id="srv-modal-title" className="text-base font-semibold text-foreground">
          Server unreachable
        </h2>
        <p id="srv-modal-desc" className="mt-1.5 text-sm text-muted">
          The API server could not be reached. Some content on this page may be
          unavailable or outdated.
        </p>

        <div className="mt-5 flex gap-2.5">
          <button
            ref={retryBtnRef}
            onClick={recheck}
            disabled={status === "checking"}
            className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "checking" ? "Checking…" : "Retry"}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Dismiss
          </button>
        </div>

        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
