import { siteConfig } from "@/lib/config/site";
import { Container } from "@/components/layout/container";
import { localePath, type Lang } from "@/lib/i18n";

const socialLinks = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Email", href: siteConfig.social.email },
];

const YEAR = new Date().getFullYear();

export function Footer({ lang, rssLabel }: { lang: Lang; rssLabel: string }) {
  return (
    <footer className="border-t border-border print:hidden">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {YEAR} {siteConfig.shortName}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          <a href={localePath(lang, "/feed.xml")} type="application/rss+xml" className="transition-colors hover:text-accent">
            {rssLabel}
          </a>
        </nav>
      </Container>
    </footer>
  );
}
