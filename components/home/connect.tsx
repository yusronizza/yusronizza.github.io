import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/config/site";

const secondaryLinks = [
  { label: "GitHub", href: siteConfig.social.github, external: true },
  { label: "LinkedIn", href: siteConfig.social.linkedin, external: true },
  { label: "Download CV", href: siteConfig.cvPdfPath, external: false },
];

export function Connect() {
  return (
    <Section title="Connect with me" index={4} className="border-t border-border">
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/profile.jpeg"
              alt={siteConfig.author.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="max-w-lg text-lg">
              Open to embedded systems and IoT roles, freelance collaborations, or just a good
              technical conversation. Reach out — I usually reply within a day.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <LinkButton href="/contact">Send a message</LinkButton>
              {secondaryLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}
