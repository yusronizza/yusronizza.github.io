import { forwardPost } from "@/lib/server/proxy-to-api";

// Contact form submissions: forwarded to the API server-side so the visitor's
// own IP (not this server's) is what the API rate-limits.
export function POST(req: Request) {
  return forwardPost(req, "/public/contact");
}
