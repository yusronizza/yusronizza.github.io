export function trackPageView(path: string, referrer?: string): void {
  fetch("/api/v1/public/analytics/pageviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, ...(referrer ? { referrer } : {}) }),
  }).catch(() => {});
}
