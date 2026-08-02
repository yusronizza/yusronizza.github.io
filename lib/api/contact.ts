import type { ContactPayload } from "@/lib/domain/types";

type ContactResult = {
  queued: boolean;
  message: string;
};

export async function sendContact(payload: ContactPayload): Promise<ContactResult> {
  const res = await fetch("/api/v1/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = json?.error ?? {};
    throw new Error(err.message ?? "Failed to send message.");
  }
  return json.data;
}
