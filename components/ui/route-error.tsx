"use client";

import { useParams } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { getDictionary, isValidLang, localePath, DEFAULT_LANG } from "@/lib/i18n";

export type RouteErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Error boundary UI in the page's language. `section` picks more specific
// wording where the dictionary has it.
export function RouteError({ section, reset }: { section?: "blog" | "projects"; reset?: () => void }) {
  const params = useParams<{ lang?: string }>();
  const lang = isValidLang(params?.lang) ? params.lang : DEFAULT_LANG;
  const t = getDictionary(lang);
  const heading = section ? t[section].loadError : t.common.errorHeading;
  const description = section ? t[section].loadErrorDescription : t.common.errorDescription;
  return (
    <div role="alert" className="flex flex-col items-start gap-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t.common.error}</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h1>
      <p className="max-w-md text-muted">{description}</p>
      <div className="flex flex-wrap gap-3">
        {reset && <Button onClick={reset}>{t.common.tryAgain}</Button>}
        <LinkButton href={localePath(lang, "/")} variant="secondary">
          {t.common.backHome}
        </LinkButton>
      </div>
    </div>
  );
}
