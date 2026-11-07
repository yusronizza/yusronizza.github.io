import { getApiHealth } from "@/lib/api/health";
import { formatTime } from "@/lib/utils/format";

// Rendered on the server from a cached check (see getApiHealth), so visitors'
// browsers never poll the API.
export async function ServerStatus() {
  const { online, latencyMs, checkedAt } = await getApiHealth();
  const tone = online ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400";

  return (
    <section aria-labelledby="system-status" className="border-t border-border py-10 sm:py-12">
      <p id="system-status" className="text-xs font-semibold uppercase tracking-widest text-muted">
        System status
      </p>
      <div className="mt-3 flex items-center gap-2.5">
        <span aria-hidden="true" className={`inline-flex h-2.5 w-2.5 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`} />
        <span className={`text-sm font-medium ${tone}`}>{online ? "API server reachable" : "API server unreachable"}</span>
        {online && latencyMs !== null && <span className="text-xs text-muted">{latencyMs} ms</span>}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Checked at <time dateTime={checkedAt}>{formatTime(new Date(checkedAt))}</time>, refreshed every minute.
      </p>
    </section>
  );
}
