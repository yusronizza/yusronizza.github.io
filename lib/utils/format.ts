const LOCALES: Record<string, string> = { en: "en-US", ja: "ja-JP", id: "id-ID" };

// Calendar dates (YYYY-MM-DD, or an ISO timestamp whose date part counts),
// formatted in UTC so the day never shifts with the server's timezone.
export function formatDate(dateString: string, lang = "en"): string {
  const date = new Date(`${dateString.slice(0, 10)}T00:00:00Z`);
  return date.toLocaleDateString(LOCALES[lang] ?? "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatMonthYear(monthString: string): string {
  if (monthString === "Present") return "Present";
  const [year, month] = monthString.split("-");
  const date = new Date(Number(year), Number(month ?? 1) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

// Rendered on the server, so shown in UTC and labelled as such.
export function formatTime(date: Date): string {
  return `${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC`;
}
