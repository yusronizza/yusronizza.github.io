import "server-only";

const API_BASE = `${process.env.API_URL ?? "http://localhost:8080"}/api/v1`;
const MAX_BODY_BYTES = 32 * 1024;

// The visitor's IP as reported by the platform in front of this app. Vercel
// sets x-forwarded-for itself (any client-supplied value is overwritten), and
// x-real-ip likewise. Elsewhere these headers can't be trusted, so we send
// nothing and the API falls back to this server's own address.
function visitorIP(req: Request): string | null {
  if (!process.env.VERCEL && process.env.TRUST_FORWARDED_FOR !== "true") return null;
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : null;
}

// Only same-site pages may use these routes: they spend this site's client
// key, so a third-party page must not be able to post through them.
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") === "same-origin";
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

// Forwards a small JSON POST from the browser to the API, server-side, with
// this site's client key and the visitor's IP (X-Visitor-IP).
export async function forwardPost(req: Request, apiPath: string): Promise<Response> {
  if (!sameOrigin(req)) return errorResponse(403, "FORBIDDEN", "Cross-site requests are not allowed.");
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return errorResponse(415, "UNSUPPORTED_MEDIA_TYPE", "Expected application/json.");
  }
  const body = await req.text();
  if (body.length > MAX_BODY_BYTES) return errorResponse(413, "PAYLOAD_TOO_LARGE", "Request body is too large.");

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.API_CLIENT_KEY) headers["X-Client-Key"] = process.env.API_CLIENT_KEY;
  const ip = visitorIP(req);
  if (ip) headers["X-Visitor-IP"] = ip;
  const userAgent = req.headers.get("user-agent");
  if (userAgent) headers["User-Agent"] = userAgent;
  const lang = req.headers.get("accept-language");
  if (lang) headers["Accept-Language"] = lang;

  try {
    const res = await fetch(`${API_BASE}${apiPath}`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    const out = new Headers({ "Content-Type": res.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" });
    const retryAfter = res.headers.get("retry-after");
    if (retryAfter) out.set("Retry-After", retryAfter);
    return new Response(text || null, { status: res.status, headers: out });
  } catch {
    return errorResponse(502, "UPSTREAM_UNAVAILABLE", "The server couldn't be reached. Please try again.");
  }
}
