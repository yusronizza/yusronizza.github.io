import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with Yusron Izza Faradisa — open to embedded systems roles, freelance collaborations, and technical conversations.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />

      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Open to embedded systems and IoT roles, freelance collaborations, or just a good technical conversation. I usually reply within a day."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Email</p>
              <a
                href={siteConfig.social.email}
                className="mt-1 text-sm text-accent hover:underline"
              >
                {siteConfig.author.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">GitHub</p>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-accent hover:underline"
              >
                {siteConfig.social.github.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">LinkedIn</p>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-accent hover:underline"
              >
                {siteConfig.social.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </Section>
    </>
  );
}
