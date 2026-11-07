export function trackPageView(path: string, referrer?: string): void {
  fetch("/api/pageview", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, ...(referrer ? { referrer } : {}) }),
  }).catch(() => {});
}
