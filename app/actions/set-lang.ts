"use server";

import { cookies } from "next/headers";
import { isValidLang, LANG_COOKIE } from "@/lib/i18n";

export async function setLang(lang: string) {
  if (!isValidLang(lang)) return;
  const cookieStore = await cookies();
  cookieStore.set(LANG_COOKIE, lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
