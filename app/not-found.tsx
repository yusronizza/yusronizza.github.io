import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-6 py-24">
      <p className="font-mono text-sm tracking-widest text-accent">{"// 404"}</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <pre className="w-full max-w-md border border-border bg-surface px-4 py-3 font-mono text-sm text-muted">
        <span className="text-accent">$</span> open page{"\n"}
        error: no such file or directory
      </pre>
      <p className="max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <LinkButton href="/">Back to home</LinkButton>
    </div>
  );
}
