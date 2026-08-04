"use client";

import { useCallback, useEffect, useState } from "react";

export type ServerOnlineStatus = "checking" | "online" | "offline";

export type ServerStatusState = {
  status: ServerOnlineStatus;
  latencyMs: number | null;
  checkedAt: Date | null;
  recheck: () => void;
};

async function pingServer(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = performance.now();
  try {
    const res = await fetch("/readyz", {
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    return { ok: res.ok, latencyMs: Math.round(performance.now() - start) };
  } catch {
    return { ok: false, latencyMs: Math.round(performance.now() - start) };
  }
}

export function useServerStatus(): ServerStatusState {
  const [status, setStatus] = useState<ServerOnlineStatus>("checking");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  const recheck = useCallback(async () => {
    setStatus("checking");
    const result = await pingServer();
    setStatus(result.ok ? "online" : "offline");
    setLatencyMs(result.ok ? result.latencyMs : null);
    setCheckedAt(new Date());
  }, []);

  useEffect(() => {
    recheck();
    const id = setInterval(recheck, 30_000);
    return () => clearInterval(id);
  }, [recheck]);

  return { status, latencyMs, checkedAt, recheck };
}
