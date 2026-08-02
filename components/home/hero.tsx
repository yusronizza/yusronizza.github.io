import { LinkButton } from "@/components/ui/button";
import { getProfile } from "@/lib/api/profile";

export async function Hero() {
  const profile = await getProfile();

  return (
    <section className="flex flex-col gap-6 py-16 sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        {profile.title} &middot; {profile.location}
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
    </section>
  );
}
