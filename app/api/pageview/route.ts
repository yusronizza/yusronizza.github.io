import { forwardPost } from "@/lib/server/proxy-to-api";

// Cookie-free page-view beacon, forwarded with the visitor's IP so unique
// visitors are counted per visitor rather than per server.
export function POST(req: Request) {
  return forwardPost(req, "/public/analytics/pageviews");
}
