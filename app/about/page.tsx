import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { profile } from "@/lib/data/profile";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: `Learn more about ${profile.name}, ${profile.title} based in ${profile.location}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <PageHeader eyebrow="About" title="About me" description={profile.tagline} />

      <Section>
        <div className="space-y-4 text-base leading-relaxed">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title="Languages" className="border-t border-border">
        <ul className="space-y-2 text-sm">
          {profile.languages.map((language) => (
            <li key={language.name} className="flex justify-between border-b border-border py-2 last:border-b-0">
              <span>{language.name}</span>
              <span className="text-muted">{language.level}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Interests" className="border-t border-border">
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <Badge key={interest}>{interest}</Badge>
          ))}
        </div>
      </Section>
    </>
  );
}
