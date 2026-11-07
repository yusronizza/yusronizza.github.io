import { LinkButton } from "@/components/ui/button";
import { getProfile } from "@/lib/api/profile";
import { siteConfig } from "@/lib/config/site";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";

function HeroCtas({ lang }: { lang: Lang }) {
  const t = getDictionary(lang).home;
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <LinkButton href={localePath(lang, "/projects")}>{t.viewProjects}</LinkButton>
      <LinkButton href={localePath(lang, "/cv")} variant="secondary">
        {t.seeCv}
      </LinkButton>
    </div>
  );
}

export async function Hero({ lang }: { lang: Lang }) {
  let profile;
  try {
    profile = await getProfile(lang);
  } catch {
    return (
      <section className="flex flex-col gap-6 py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {siteConfig.author.name}
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {siteConfig.tagline}
        </h1>
        <HeroCtas lang={lang} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 py-16 sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        {profile.name}
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {profile.tagline}
      </h1>
      <p className="text-sm text-muted">{profile.title} &middot; {profile.location}</p>
      <p className="max-w-xl text-lg text-muted">{profile.bio[0]}</p>
      <HeroCtas lang={lang} />
    </section>
  );
}
