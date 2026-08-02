import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/data/projects";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: `No project with slug '${slug}' exists.`, field: null } },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: project });
}
