"use client";

import { useCallback, useEffect, useState } from "react";

type Status = "checking" | "connected" | "offline";

type CheckResult = {
  status: Status;
  latencyMs: number | null;
  checkedAt: Date;
};

async function checkServer(): Promise<CheckResult> {
  const start = performance.now();
  try {
    const res = await fetch("/api/v1/profile", {
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    const latencyMs = Math.round(performance.now() - start);
    return {
      status: res.ok ? "connected" : "offline",
      latencyMs,
      checkedAt: new Date(),
    };
  } catch {
    return { status: "offline", latencyMs: null, checkedAt: new Date() };
  }
}

function StatusDot({ status }: { status: Status }) {
  if (status === "checking") {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-border opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-border" />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex h-2.5 w-2.5 rounded-full ${
        status === "connected" ? "bg-green-500" : "bg-red-500"
      }`}
    />
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function ServerStatus() {
  const [result, setResult] = useState<CheckResult | null>(null);

  const run = useCallback(async () => {
    setResult(null);
    const r = await checkServer();
    setResult(r);
  }, []);

  useEffect(() => {
    run();
    const id = setInterval(run, 30_000);
    return () => clearInterval(id);
  }, [run]);

  const status: Status = result?.status ?? "checking";

  return (
    <section className="border-t border-border py-10 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            System status
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <StatusDot status={status} />
            <span
              className={`text-sm font-medium ${
                status === "checking"
                  ? "text-muted"
                  : status === "connected"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {status === "checking"
                ? "Checking…"
                : status === "connected"
                ? "API server reachable"
                : "API server unreachable"}
            </span>
            {result?.latencyMs !== null && result?.status === "connected" && (
              <span className="text-xs text-muted">{result.latencyMs} ms</span>
            )}
          </div>
          {result && (
            <p className="mt-1.5 text-xs text-muted">
              Last checked at {formatTime(result.checkedAt)}
            </p>
          )}
        </div>

        <button
          onClick={run}
          disabled={status === "checking"}
          className="shrink-0 self-start rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check again
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-border/50 bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-muted">API endpoint</span>
          <span className="font-mono text-xs text-foreground">/api/v1</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-muted">Status</span>
          <span
            className={`text-xs font-medium ${
              status === "checking"
                ? "text-muted"
                : status === "connected"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {status === "checking" ? "—" : status === "connected" ? "200 OK" : "Unreachable"}
          </span>
        </div>
        {result?.latencyMs !== null && (
          <div className="mt-2 flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-muted">Latency</span>
            <span className="text-xs text-foreground">
              {result?.status === "connected" ? `${result.latencyMs} ms` : "—"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
