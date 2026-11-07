import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/config/site";
import { getDictionary } from "@/lib/i18n";
import { resolveLang, type LangParams } from "@/lib/i18n/params";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await resolveLang(params);
  const t = getDictionary(lang).contact;
  return createMetadata({ lang, title: t.eyebrow, description: t.metaDescription, path: "/contact" });
}

const channels = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
];

export default async function ContactPage({ params }: LangParams) {
  const lang = await resolveLang(params);
  const t = getDictionary(lang).contact;
  return (
    <>
      <JsonLd data={breadcrumbSchema(lang, [{ name: t.eyebrow, path: "/contact" }])} />
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">{t.email}</p>
              <a href={siteConfig.social.email} className="mt-1 text-sm text-accent hover:underline">
                {siteConfig.author.email}
              </a>
            </div>
            {channels.map((c) => (
              <div key={c.label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{c.label}</p>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-accent hover:underline">
                  {c.href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            ))}
          </div>
          <ContactForm labels={t} />
        </div>
      </Section>
    </>
  );
}
