import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/data/posts";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: `No post with slug '${slug}' exists.`, field: null } },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: post });
}
