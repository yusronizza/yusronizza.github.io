import { cookies } from "next/headers";
import { DEFAULT_LANG, isValidLang, LANG_COOKIE, type Lang } from "@/lib/i18n";

export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const val = cookieStore.get(LANG_COOKIE)?.value;
  return isValidLang(val) ? val : DEFAULT_LANG;
}
