import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={`border border-border bg-surface transition-colors ${className}`}>
      {label && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[11px] text-muted">
          <span>{label}</span>
          <span className="text-accent">$</span>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
