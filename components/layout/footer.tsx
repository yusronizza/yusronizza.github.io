import { siteConfig } from "@/lib/config/site";
import { Container } from "@/components/layout/container";

const socialLinks = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Email", href: siteConfig.social.email },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border print:hidden">
      <Container className="flex flex-col gap-4 py-10 font-mono text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <span className="text-accent">$</span> status: online
          <span className="inline-block h-3 w-1.5 animate-pulse bg-accent" aria-hidden="true" />
          <span className="text-muted">&middot; &copy; {year} {siteConfig.shortName}</span>
        </p>
        <nav className="flex gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-accent"
            >
              [{link.label}]
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
