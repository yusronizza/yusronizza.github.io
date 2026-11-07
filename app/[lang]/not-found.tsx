"use client";

import { useParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { DEFAULT_LANG, getDictionary, isValidLang, localePath } from "@/lib/i18n";

// not-found boundaries receive no props; the language comes from the route.
export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = isValidLang(params?.lang) ? params.lang : DEFAULT_LANG;
  const t = getDictionary(lang).common;
  return (
    <div className="flex flex-col items-start gap-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">404</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.notFoundTitle}</h1>
      <p className="max-w-md text-muted">{t.notFoundDescription}</p>
      <LinkButton href={localePath(lang, "/")}>{t.backHome}</LinkButton>
    </div>
  );
}
