import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-surface shadow-sm transition-shadow ${className}`}>
      <div className="p-6">{children}</div>
    </div>
  );
}
