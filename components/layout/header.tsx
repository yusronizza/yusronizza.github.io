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
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur print:hidden">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          <span className="text-accent">~/</span>
          {siteConfig.shortName}
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {siteConfig.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 font-mono text-sm transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                <span aria-hidden="true" className={active ? "text-accent" : "text-transparent"}>
                  [
                </span>
                {item.label}
                <span aria-hidden="true" className={active ? "text-accent" : "text-transparent"}>
                  ]
                </span>
              </Link>
            );
          })}
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
            className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground"
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
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 font-mono text-sm ${active ? "text-accent" : "text-muted"}`}
                >
                  <span aria-hidden="true" className={active ? "text-accent" : "text-transparent"}>
                    [
                  </span>
                  {item.label}
                  <span aria-hidden="true" className={active ? "text-accent" : "text-transparent"}>
                    ]
                  </span>
                </Link>
              );
            })}
            <SocialIconLinks className="mt-2 border-t border-border px-3 pt-3" />
          </Container>
        </nav>
      )}
    </header>
  );
}
