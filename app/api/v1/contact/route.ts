import { NextRequest, NextResponse } from "next/server";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: NextRequest) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Request body must be valid JSON.", field: null } },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Field 'name' is required.", field: "name" } },
      { status: 400 }
    );
  }
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Field 'email' must be a valid email address.", field: "email" } },
      { status: 400 }
    );
  }
  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Field 'subject' is required.", field: "subject" } },
      { status: 400 }
    );
  }
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Field 'message' is required.", field: "message" } },
      { status: 400 }
    );
  }

  // Log in development; wire up Resend (or similar) with RESEND_API_KEY in production
  console.log("[contact]", { name, email, subject, message: (message as string).slice(0, 80) });

  return NextResponse.json(
    { data: { queued: true, message: "Your message has been received. Yusron will get back to you shortly." } },
    { status: 202 }
  );
}
