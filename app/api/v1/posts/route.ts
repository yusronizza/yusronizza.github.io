import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/data/posts";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tag = searchParams.get("tag");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 100);

  let posts = getAllPosts();
  if (tag) posts = posts.filter((p) => p.tags.includes(tag));
  const total = posts.length;
  const page = posts.slice(0, limit).map(({ content, ...rest }) => rest);

  return NextResponse.json({ data: page, meta: { total, limit, next_cursor: null, prev_cursor: null } });
}
