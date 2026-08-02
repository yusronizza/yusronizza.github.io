import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, getFeaturedProjects } from "@/lib/data/projects";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const featured = searchParams.get("featured") === "true";
  const tag = searchParams.get("tag");

  let projects = featured ? getFeaturedProjects() : getAllProjects();
  if (tag) projects = projects.filter((p) => p.tags.includes(tag));

  return NextResponse.json({ data: projects });
}
