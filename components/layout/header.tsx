"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { Container } from "@/components/layout/container";
import { SocialIconLinks } from "@/components/layout/social-icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { MenuItem } from "@/lib/domain/types";

const ChevronDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export function Header({ menu }: { menu: MenuItem[] }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  function isActive(path: string) {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  const visibleItems = menu.filter((item) => item.isVisible);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur print:hidden">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {siteConfig.shortName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {visibleItems.map((item) => {
            const active = isActive(item.path);
            const hasChildren = !!item.children?.length;

            if (hasChildren) {
              return (
                <div key={item.id} className="group relative">
                  <Link
                    href={item.path}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block">
                    <div className="min-w-[160px] rounded-lg border border-border bg-background py-1 shadow-lg">
                      {item.children!.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive(child.path)
                              ? "text-accent"
                              : "text-muted hover:bg-surface hover:text-foreground"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
            <SocialIconLinks />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
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

      {/* Mobile nav */}
      {isMenuOpen && (
        <nav className="border-t border-border sm:hidden">
          <Container className="flex flex-col py-2">
            {visibleItems.map((item) => {
              const active = isActive(item.path);
              const hasChildren = !!item.children?.length;
              const isExpanded = expandedItem === item.id;

              return (
                <div key={item.id}>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                        active ? "text-accent" : "text-muted"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                        active ? "text-accent" : "text-muted"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                  {hasChildren && isExpanded && (
                    <div className="ml-4 border-l border-border pl-3">
                      {item.children!.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path}
                          onClick={() => { setIsMenuOpen(false); setExpandedItem(null); }}
                          className={`block rounded-lg px-3 py-1.5 text-sm ${
                            isActive(child.path) ? "text-accent" : "text-muted"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <SocialIconLinks className="mt-2 border-t border-border px-3 pt-3" />
          </Container>
        </nav>
      )}
    </header>
  );
}
