export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center font-mono text-xs text-muted">
      <span className="text-accent">[</span>
      {children}
      <span className="text-accent">]</span>
    </span>
  );
}
