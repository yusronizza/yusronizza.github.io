"use client";

import { useState } from "react";
import type { ContactPayload } from "@/lib/domain/types";

type Field = keyof ContactPayload;
type FormState = "idle" | "submitting" | "success" | "error";

const INITIAL: ContactPayload = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [fields, setFields] = useState<ContactPayload>(INITIAL);
  const [state, setState] = useState<FormState>("idle");
  const [feedback, setFeedback] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});

  function set(key: Field, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setFieldErrors({});
    setFeedback("");

    try {
      const res = await fetch("/api/v1/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const json = await res.json().catch(() => null);

      if (res.status === 202) {
        setState("success");
        setFeedback(json?.data?.message ?? "Message sent. I'll get back to you soon.");
        setFields(INITIAL);
        return;
      }

      if (res.status === 400 && json?.error) {
        if (json.error.field) {
          setFieldErrors({ [json.error.field]: json.error.message });
        } else {
          setFeedback(json.error.message ?? "Validation error.");
        }
        setState("error");
        return;
      }

      if (res.status === 429) {
        setFeedback("Too many requests. Please wait before trying again.");
        setState("error");
        return;
      }

      setFeedback("Something went wrong. Please try again.");
      setState("error");
    } catch {
      setFeedback("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  const isSubmitting = state === "submitting";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          type="text"
          value={fields.name}
          onChange={(v) => set("name", v)}
          error={fieldErrors.name}
          required
          disabled={isSubmitting}
          placeholder="Yusron Izza"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={fields.email}
          onChange={(v) => set("email", v)}
          error={fieldErrors.email}
          required
          disabled={isSubmitting}
          placeholder="you@example.com"
        />
      </div>

      <Field
        id="subject"
        label="Subject"
        type="text"
        value={fields.subject}
        onChange={(v) => set("subject", v)}
        error={fieldErrors.subject}
        required
        disabled={isSubmitting}
        placeholder="Collaboration inquiry"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message <span className="text-accent" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          required
          disabled={isSubmitting}
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell me about your project or just say hi..."
          className="resize-y rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        {fieldErrors.message && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.message}</p>
        )}
      </div>

      {state === "success" && (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
          {feedback}
        </p>
      )}

      {state === "error" && feedback && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {feedback}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}{" "}
        {required && <span className="text-accent" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
