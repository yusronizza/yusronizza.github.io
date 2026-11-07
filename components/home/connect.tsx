import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/config/site";
import { getDictionary, localePath, type Lang } from "@/lib/i18n";


export function Connect({ lang }: { lang: Lang }) {
  const t = getDictionary(lang).home;
  const secondaryLinks = [
    { label: "GitHub", href: siteConfig.social.github, external: true },
    { label: "LinkedIn", href: siteConfig.social.linkedin, external: true },
    { label: t.downloadCv, href: siteConfig.cvPdfPath, external: false },
  ];
  return (
    <Section title={t.connectTitle} index={4} className="border-t border-border">
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
            <p className="max-w-lg text-lg">{t.connectBody}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <LinkButton href={localePath(lang, "/contact")}>{t.sendMessage}</LinkButton>
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
