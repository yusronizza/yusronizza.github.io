import type { ReactNode } from "react";

export function Section({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      {title && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
          {description && <p className="mt-2 text-muted">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
