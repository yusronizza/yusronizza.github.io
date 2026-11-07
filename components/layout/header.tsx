"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { SocialIconLinks } from "@/components/layout/social-icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { siteConfig } from "@/lib/config/site";
import { localePath, splitLocale, type Lang } from "@/lib/i18n";

export type NavItem = {
  id: number;
  label: string;
  /** Unprefixed path, used to decide which item is active. */
  path: string;
  /** Localized href. */
  href: string;
  external: boolean;
  children?: NavItem[];
};

type Labels = { toggleMenu: string; toggleTheme: string; language: string };

const ChevronDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function NavLink({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export function Header({ nav, lang, labels }: { nav: NavItem[]; lang: Lang; labels: Labels }) {
  const { path: current } = splitLocale(usePathname());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  function isActive(path: string) {
    if (path === "/") return current === "/";
    return current === path || current.startsWith(`${path}/`);
  }

  const pill = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur print:hidden">
      <Container className="flex h-16 items-center justify-between">
        <Link href={localePath(lang, "/")} className="text-base font-semibold tracking-tight">
          {siteConfig.shortName}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {nav.map((item) =>
            item.children?.length ? (
              // Opens on hover and on keyboard focus (focus-within).
              <div key={item.id} className="group relative">
                <NavLink item={item} className={`flex items-center gap-1 ${pill(isActive(item.path))}`} />
                <div className="absolute left-0 top-full hidden pt-1 group-focus-within:block group-hover:block">
                  <div className="min-w-[160px] rounded-lg border border-border bg-background py-1 shadow-lg">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        item={child}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive(child.path) ? "text-accent" : "text-muted hover:bg-surface hover:text-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={item.id} item={item} className={pill(isActive(item.path))} />
            )
          )}
          <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
            <LanguageSwitcher current={lang} label={labels.language} />
            <SocialIconLinks />
            <ThemeToggle label={labels.toggleTheme} />
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle label={labels.toggleTheme} />
          <button
            type="button"
            aria-label={labels.toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4" aria-hidden="true">
              {isMenuOpen ? <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile nav */}
      {isMenuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-border sm:hidden">
          <Container className="flex flex-col py-2">
            {nav.map((item) => {
              const active = isActive(item.path);
              const isExpanded = expandedItem === item.id;
              return (
                <div key={item.id}>
                  {item.children?.length ? (
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${active ? "text-accent" : "text-muted"}`}
                    >
                      {item.label}
                      <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <NavLink
                      item={item}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium ${active ? "text-accent" : "text-muted"}`}
                    />
                  )}
                  {item.children?.length && isExpanded ? (
                    <div className="ml-4 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.id}
                          item={child}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setExpandedItem(null);
                          }}
                          className={`block rounded-lg px-3 py-1.5 text-sm ${isActive(child.path) ? "text-accent" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="mt-2 border-t border-border px-3 pt-3">
              <LanguageSwitcher current={lang} label={labels.language} />
            </div>
            <SocialIconLinks className="border-t border-border px-3 pt-3" />
          </Container>
        </nav>
      )}
    </header>
  );
}
