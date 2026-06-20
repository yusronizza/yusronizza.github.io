export function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatMonthYear(monthString: string): string {
  if (monthString === "Present") return "Present";
  const [year, month] = monthString.split("-");
  const date = new Date(Number(year), Number(month ?? 1) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
