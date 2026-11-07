import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getProfile } from "@/lib/api/profile";
import { getDictionary } from "@/lib/i18n";
import { resolveLang, type LangParams } from "@/lib/i18n/params";

export const revalidate = 3600;

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await resolveLang(params);
  const t = getDictionary(lang).about;
  try {
    const profile = await getProfile(lang);
    return createMetadata({ lang, title: t.eyebrow, description: t.metaDescription(profile.name, profile.title, profile.location), path: "/about" });
  } catch {
    return createMetadata({ lang, title: t.eyebrow, description: t.title, path: "/about" });
  }
}

export default async function AboutPage({ params }: LangParams) {
  const lang = await resolveLang(params);
  const t = getDictionary(lang).about;
  const profile = await getProfile(lang);
  return (
    <>
      <JsonLd data={breadcrumbSchema(lang, [{ name: t.eyebrow, path: "/about" }])} />
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={profile.tagline} />
      <Section>
        <div className="space-y-4 text-base leading-relaxed">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>
      <Section title={t.languages} index={1} className="border-t border-border">
        <ul className="space-y-2 text-sm">
          {profile.languages.map((language) => (
            <li key={language.name} className="flex justify-between border-b border-border py-2 last:border-b-0">
              <span>{language.name}</span>
              <span className="text-muted">{language.level}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={t.interests} index={2} className="border-t border-border">
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <Badge key={interest}>{interest}</Badge>
          ))}
        </div>
      </Section>
    </>
  );
}
