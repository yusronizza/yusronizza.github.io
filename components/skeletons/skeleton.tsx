export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-border/50 ${className}`}
      aria-hidden="true"
    />
  );
}
