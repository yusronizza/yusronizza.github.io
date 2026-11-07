import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/api/client";

// On-demand revalidation, called by the API after every admin write
// (SITE_REVALIDATE_URL/SITE_REVALIDATE_SECRET on the API side). Pages are
// cached for an hour otherwise, so this is what makes an edit show up within
// seconds. Only the known content tags can be revalidated.
const KNOWN_TAGS = new Set<string>(Object.values(TAGS));

function authorized(req: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ error: { code: "UNAUTHORIZED", message: "Invalid revalidation secret." } }, { status: 401 });

  let tags: unknown;
  try {
    ({ tags } = await req.json());
  } catch {
    return Response.json({ error: { code: "BAD_REQUEST", message: "Body must be JSON: {\"tags\": [...]}" } }, { status: 400 });
  }
  if (!Array.isArray(tags) || tags.length === 0) {
    return Response.json({ error: { code: "BAD_REQUEST", message: "Provide a non-empty \"tags\" array." } }, { status: 400 });
  }
  const valid = [...new Set(tags.filter((t): t is string => typeof t === "string" && KNOWN_TAGS.has(t)))];
  // expire: 0 — the next request renders fresh content instead of being
  // served the stale page once more while it revalidates.
  for (const tag of valid) revalidateTag(tag, { expire: 0 });
  return Response.json({ data: { revalidated: valid } }, { headers: { "Cache-Control": "no-store" } });
}
