import { LinkButton } from "@/components/ui/button";
import { profile } from "@/lib/data/profile";

export function Hero() {
  return (
    <section className="flex flex-col gap-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-muted">
        <span className="text-accent">{">"}</span> whoami
      </p>
      <p className="font-mono text-sm tracking-widest text-accent">
        {profile.title} {"//"} {profile.location}
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {profile.tagline}
      </h1>
      <p className="max-w-xl text-lg text-muted">{profile.bio[0]}</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <LinkButton href="/projects">View projects</LinkButton>
        <LinkButton href="/cv" variant="secondary">
          See full CV
        </LinkButton>
      </div>
      <p className="flex items-center gap-2 font-mono text-xs text-muted">
        ready
        <span className="inline-block h-3 w-1.5 animate-pulse bg-accent" aria-hidden="true" />
      </p>
    </section>
  );
}
