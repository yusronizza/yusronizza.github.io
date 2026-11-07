import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { ExperienceItem } from "@/components/cv/experience-item";
import { EducationItem } from "@/components/cv/education-item";
import { SkillsSection } from "@/components/cv/skills-section";
import { AwardItem } from "@/components/cv/award-item";
import { VolunteeringItem } from "@/components/cv/volunteering-item";
import { ContactRow } from "@/components/cv/contact-row";
import { PrintButton } from "@/components/cv/print-button";
import { LinkButton } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, personSchema } from "@/lib/seo/schema";
import { getProfile } from "@/lib/api/profile";
import { getDictionary } from "@/lib/i18n";
import { resolveLang, type LangParams } from "@/lib/i18n/params";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 3600;

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await resolveLang(params);
  const t = getDictionary(lang);
  try {
    const profile = await getProfile(lang);
    return createMetadata({ lang, title: t.nav.cv, description: t.cv.metaDescription(profile.name), path: "/cv" });
  } catch {
    return createMetadata({ lang, title: t.nav.cv, description: t.cv.eyebrow, path: "/cv" });
  }
}

export default async function CvPage({ params }: LangParams) {
  const lang = await resolveLang(params);
  const t = getDictionary(lang);
  const profile = await getProfile(lang);

  return (
    <>
      <JsonLd data={personSchema(profile)} />
      <JsonLd data={breadcrumbSchema(lang, [{ name: t.nav.cv, path: "/cv" }])} />

      <PageHeader
        eyebrow={t.cv.eyebrow}
        title={profile.name}
        description={profile.title}
        actions={
          <>
            <LinkButton href={siteConfig.cvPdfPath} external>
              {t.cv.downloadPdf}
            </LinkButton>
            <PrintButton label={t.cv.print} />
          </>
        }
      />

      <ContactRow profile={profile} />

      <Section title={t.cv.experience} index={1}>
        <div>
          {profile.experience.map((entry) => (
            <ExperienceItem key={`${entry.role}-${entry.organization}-${entry.startDate}`} entry={entry} />
          ))}
        </div>
      </Section>

      <Section title={t.cv.education} index={2} className="border-t border-border">
        <div>
          {profile.education.map((entry) => (
            <EducationItem key={entry.institution} entry={entry} />
          ))}
        </div>
      </Section>

      <Section title={t.cv.skills} index={3} className="border-t border-border">
        <SkillsSection groups={profile.skills} />
      </Section>

      <Section title={t.cv.certifications} index={4} className="border-t border-border">
        <ul className="space-y-2 text-sm">
          {profile.certifications.map((cert) => (
            <li
              key={cert.name}
              className="flex flex-col justify-between gap-1 border-b border-border py-2 last:border-b-0 sm:flex-row"
            >
              <span>
                {cert.name} &middot; <span className="text-muted">{cert.issuer}</span>
              </span>
              <span className="text-xs text-muted">{cert.date}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.cv.awards} index={5} className="border-t border-border">
        <ul>
          {profile.awards.map((award) => (
            <AwardItem key={award.name} entry={award} />
          ))}
        </ul>
      </Section>

      <Section title={t.cv.volunteering} index={6} className="border-t border-border">
        <div>
          {profile.volunteering.map((entry) => (
            <VolunteeringItem key={`${entry.organization}-${entry.year}`} entry={entry} />
          ))}
        </div>
      </Section>
    </>
  );
}
