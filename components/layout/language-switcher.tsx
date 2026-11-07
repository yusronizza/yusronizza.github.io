"use client";

import { usePathname } from "next/navigation";
import { LANG_LABELS, LANG_NAMES, SUPPORTED_LANGS, localePath, splitLocale, type Lang } from "@/lib/i18n";

// Links to the current page in each language: real URLs (not a cookie), so
// every language version is crawlable. Plain <a> rather than <Link>:
// switching language swaps the root layout (<html lang>), which is a full
// page load anyway, and prefetching across root layouts fails.
export function LanguageSwitcher({ current, label }: { current: Lang; label: string }) {
  const { path } = splitLocale(usePathname());
  return (
    <nav aria-label={label} className="flex items-center gap-1 text-xs font-medium">
      {SUPPORTED_LANGS.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="select-none text-border">·</span>}
          {code === current ? (
            <span aria-current="true" lang={code} className="text-accent">
              {LANG_LABELS[code]}
            </span>
          ) : (
            <a href={localePath(code, path)} hrefLang={code} lang={code} title={LANG_NAMES[code]} className="text-muted transition-colors hover:text-foreground">
              {LANG_LABELS[code]}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}
