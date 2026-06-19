"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { Container } from "@/components/layout/container";
import { SocialIconLinks } from "@/components/layout/social-icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur print:hidden">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          {siteConfig.shortName}
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-surface text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
            <SocialIconLinks />
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              {isMenuOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {isMenuOpen && (
        <nav className="border-t border-border sm:hidden">
          <Container className="flex flex-col py-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isActive(item.href) ? "bg-surface text-foreground" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <SocialIconLinks className="mt-2 border-t border-border px-3 pt-3" />
          </Container>
        </nav>
      )}
    </header>
  );
}
