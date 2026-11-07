"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANG_LABELS, LANG_NAMES, SUPPORTED_LANGS, localePath, splitLocale, type Lang } from "@/lib/i18n";

// Links to the current page in each language. Plain links (not a cookie)
// so every language version has its own crawlable URL.
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
            <Link href={localePath(code, path)} hrefLang={code} lang={code} title={LANG_NAMES[code]} className="text-muted transition-colors hover:text-foreground">
              {LANG_LABELS[code]}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
