import { NextRequest, NextResponse } from "next/server";
import { profile } from "@/lib/data/profile";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = searchParams.get("current") === "true";
  const experience = current
    ? profile.experience.filter((e) => e.endDate === "Present")
    : profile.experience;
  return NextResponse.json({ data: experience });
}
