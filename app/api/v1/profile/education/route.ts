import { NextResponse } from "next/server";
import { profile } from "@/lib/data/profile";

export async function GET() {
  return NextResponse.json({ data: profile.education });
}
