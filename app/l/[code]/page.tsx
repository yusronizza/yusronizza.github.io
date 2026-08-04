import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLink } from "@/lib/api/links";
import { ApiError } from "@/lib/api/client";
import { RedirectCountdown } from "./redirect-countdown";

export const dynamic = "force-dynamic";

type LinkRedirectPageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: LinkRedirectPageProps): Promise<Metadata> {
  const { code } = await params;
  try {
    const link = await resolveLink(code);
    const host = new URL(link.targetUrl).hostname;
    return { title: `Redirecting to ${host}` };
  } catch {
    return {};
  }
}

export default async function LinkRedirectPage({ params }: LinkRedirectPageProps) {
  const { code } = await params;

  let link;
  try {
    link = await resolveLink(code);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return <RedirectCountdown link={link} />;
}
