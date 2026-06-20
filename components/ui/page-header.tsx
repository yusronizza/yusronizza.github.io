import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-border py-12 shadow-[inset_0_3px_0_0_var(--accent)] sm:py-16">
      {eyebrow && (
        <p className="mb-3 font-mono text-sm tracking-widest text-accent">
          <span aria-hidden="true">{"// "}</span>
          {eyebrow.toUpperCase()}
        </p>
      )}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-3 max-w-xl text-base text-muted">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap shrink-0 gap-3 print:hidden">{actions}</div>}
      </div>
    </div>
  );
}
