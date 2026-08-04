"use client";

import { useServerStatus, type ServerOnlineStatus } from "@/lib/hooks/use-server-status";
import { formatTime } from "@/lib/utils/format";

function StatusDot({ status }: { status: ServerOnlineStatus }) {
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
        status === "online" ? "bg-green-500" : "bg-red-500"
      }`}
    />
  );
}

function statusTextClass(s: ServerOnlineStatus): string {
  if (s === "online") return "text-green-600 dark:text-green-400";
  if (s === "offline") return "text-red-600 dark:text-red-400";
  return "text-muted";
}

export function ServerStatus() {
  const { status, latencyMs, checkedAt, recheck } = useServerStatus();

  return (
    <section className="border-t border-border py-10 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            System status
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <StatusDot status={status} />
            <span className={`text-sm font-medium ${statusTextClass(status)}`}>
              {status === "checking"
                ? "Checking…"
                : status === "online"
                ? "API server reachable"
                : "API server unreachable"}
            </span>
            {status === "online" && latencyMs !== null && (
              <span className="text-xs text-muted">{latencyMs} ms</span>
            )}
          </div>
          {checkedAt !== null && (
            <p className="mt-1.5 text-xs text-muted">
              Last checked at {formatTime(checkedAt)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={recheck}
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
          <span className={`text-xs font-medium ${statusTextClass(status)}`}>
            {status === "checking" ? "—" : status === "online" ? "200 OK" : "Unreachable"}
          </span>
        </div>
        {checkedAt !== null && (
          <div className="mt-2 flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-muted">Latency</span>
            <span className="text-xs text-foreground">
              {status === "online" && latencyMs !== null ? `${latencyMs} ms` : "—"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
