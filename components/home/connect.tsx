import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/config/site";
import { profile } from "@/lib/data/profile";

const secondaryLinks = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Download CV", href: "/files/Yusron_Izza_Faradisa_CV.pdf" },
];

export function Connect() {
  return (
    <Section title="Connect with me" index={4} className="border-t border-border">
      <Card label="~/contact">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden border border-border">
            <Image
              src="/images/profile.jpeg"
              alt={profile.name}
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
              <LinkButton href={siteConfig.social.email}>Email me</LinkButton>
              {secondaryLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-accent hover:underline"
                >
                  [{link.label}]
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}
