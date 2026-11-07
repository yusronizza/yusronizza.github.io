"use client";

import { useTransition } from "react";
import { setLang } from "@/app/actions/set-lang";
import { SUPPORTED_LANGS, LANG_LABELS, type Lang } from "@/lib/i18n";

export function LanguageSwitcher({ current }: { current: Lang }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {SUPPORTED_LANGS.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className="text-border select-none">·</span>}
          <button
            type="button"
            disabled={isPending || current === code}
            onClick={() => startTransition(() => setLang(code))}
            className={`transition-colors ${
              current === code
                ? "text-accent"
                : "text-muted hover:text-foreground disabled:cursor-not-allowed"
            }`}
          >
            {LANG_LABELS[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
