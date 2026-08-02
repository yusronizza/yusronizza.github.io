import { NextRequest, NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/data/tools";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: `No tool with slug '${slug}' exists.`, field: null } },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: tool });
}
