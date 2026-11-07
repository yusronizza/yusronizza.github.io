import "server-only";

export type ApiHealth = { online: boolean; latencyMs: number | null; checkedAt: string };

// One readiness check shared by every visitor: the result is cached for a
// minute, so the database is pinged at most once a minute however many
// people open the page (it used to be once per visitor every 30 seconds).
export async function getApiHealth(): Promise<ApiHealth> {
  const base = process.env.API_URL ?? "http://localhost:8080";
  const start = performance.now();
  try {
    const res = await fetch(`${base}/readyz`, { next: { revalidate: 60, tags: ["health"] }, signal: AbortSignal.timeout(5000) });
    return { online: res.ok, latencyMs: res.ok ? Math.round(performance.now() - start) : null, checkedAt: new Date().toISOString() };
  } catch {
    return { online: false, latencyMs: null, checkedAt: new Date().toISOString() };
  }
}
