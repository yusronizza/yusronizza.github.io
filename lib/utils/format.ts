export function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatMonthYear(monthString: string): string {
  if (monthString === "Present") return "Present";
  const [year, month] = monthString.split("-");
  const date = new Date(Number(year), Number(month ?? 1) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
