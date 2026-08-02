"use client";

import { useState } from "react";
import { contactApi } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setErrorMessage("");
    setStatus("loading");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await contactApi.send({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.field) {
          setFieldErrors({ [err.field]: err.message } as FieldErrors);
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border/60 bg-surface p-6 shadow-sm">
        <p className="font-semibold text-foreground">Message sent</p>
        <p className="mt-1 text-sm text-muted">
          Thanks for reaching out — I&apos;ll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-accent hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={fieldErrors.name} />
        <Field label="Email" name="email" type="email" error={fieldErrors.email} />
      </div>
      <Field label="Subject" name="subject" error={fieldErrors.subject} />
      <Field label="Message" name="message" as="textarea" rows={5} error={fieldErrors.message} />
      {errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  as,
  rows,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "textarea";
  rows?: number;
  error?: string;
}) {
  const inputClass =
    "mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm text-foreground bg-background focus:outline-none focus:border-accent transition-colors " +
    (error ? "border-red-400" : "border-border/60 hover:border-border");

  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      {as === "textarea" ? (
        <textarea name={name} rows={rows} className={inputClass} />
      ) : (
        <input type={type} name={name} className={inputClass} />
      )}
      {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
