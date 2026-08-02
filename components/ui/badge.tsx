export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
      {children}
    </span>
  );
}
