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
import { profile } from "@/lib/data/profile";

export const metadata: Metadata = createMetadata({
  title: "CV",
  description: `Curriculum vitae for ${profile.name}: experience, education, skills, certifications, awards and volunteering.`,
  path: "/cv",
});

export default function CvPage() {
  return (
    <>
      <JsonLd data={personSchema(profile)} />
      <JsonLd data={breadcrumbSchema([{ name: "CV", path: "/cv" }])} />

      <PageHeader
        eyebrow="Curriculum Vitae"
        title={profile.name}
        description={profile.title}
        actions={
          <>
            <LinkButton href="/files/Yusron_Izza_Faradisa_CV.pdf" external>
              Download CV (PDF)
            </LinkButton>
            <PrintButton />
          </>
        }
      />

      <ContactRow profile={profile} />

      <Section title="Experience" index={1}>
        <div>
          {profile.experience.map((entry) => (
            <ExperienceItem key={`${entry.role}-${entry.organization}-${entry.startDate}`} entry={entry} />
          ))}
        </div>
      </Section>

      <Section title="Education" index={2} className="border-t border-border">
        <div>
          {profile.education.map((entry) => (
            <EducationItem key={entry.institution} entry={entry} />
          ))}
        </div>
      </Section>

      <Section title="Skills" index={3} className="border-t border-border">
        <SkillsSection groups={profile.skills} />
      </Section>

      <Section title="Certifications" index={4} className="border-t border-border">
        <ul className="space-y-2 text-sm">
          {profile.certifications.map((cert) => (
            <li
              key={cert.name}
              className="flex flex-col justify-between gap-1 border-b border-border py-2 last:border-b-0 sm:flex-row"
            >
              <span>
                {cert.name} &middot; <span className="text-muted">{cert.issuer}</span>
              </span>
              <span className="font-mono text-xs text-muted">{cert.date}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Awards" index={5} className="border-t border-border">
        <ul>
          {profile.awards.map((award) => (
            <AwardItem key={award.name} entry={award} />
          ))}
        </ul>
      </Section>

      <Section title="Volunteering" index={6} className="border-t border-border">
        <div>
          {profile.volunteering.map((entry) => (
            <VolunteeringItem key={`${entry.organization}-${entry.year}`} entry={entry} />
          ))}
        </div>
      </Section>
    </>
  );
}
