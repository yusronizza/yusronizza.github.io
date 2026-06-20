import type { ReactNode } from "react";

export function Section({
  title,
  description,
  children,
  className = "",
  index,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      {title && (
        <div className="mb-8 flex items-baseline gap-3">
          {typeof index === "number" && (
            <span className="font-mono text-sm text-accent">{String(index).padStart(2, "0")}</span>
          )}
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
            {description && <p className="mt-2 text-muted">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
