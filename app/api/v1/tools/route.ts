import { NextResponse } from "next/server";
import { getAllTools } from "@/lib/data/tools";

export async function GET() {
  return NextResponse.json({ data: getAllTools() });
}
