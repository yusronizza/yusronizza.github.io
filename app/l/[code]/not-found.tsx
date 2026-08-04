import Link from "next/link";
import { Section } from "@/components/ui/section";

export default function LinkNotFound() {
  return (
    <Section>
      <div className="py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Link not found</h1>
        <p className="mt-3 text-muted">
          This short link doesn&apos;t exist or has expired.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          Go home
        </Link>
      </div>
    </Section>
  );
}
