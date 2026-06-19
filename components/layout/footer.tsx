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
      <Container className="flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
        <nav className="flex gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
