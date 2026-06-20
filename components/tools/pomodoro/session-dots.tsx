export function SessionDots({ total, completed }: { total: number; completed: number }) {
  const positionInCycle = total > 0 ? completed % total : 0;

  return (
    <div className="flex items-center justify-center gap-2" aria-label={`${positionInCycle} of ${total} sessions completed this cycle`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-2 w-2 transition-colors ${
            index < positionInCycle ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}
