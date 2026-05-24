import { headers, cookies } from "next/headers";
import { translations } from "./translations";
import type { Locale } from "./translations";

export async function getLocale(): Promise<Locale> {
  // Manual override cookie takes priority over browser preference
  const jar = await cookies();
  const saved = jar.get("locale")?.value;
  if (saved === "en" || saved === "fr") return saved;

  // Fall back to the browser's Accept-Language header
  const h = await headers();
  const acceptLanguage = h.get("accept-language") ?? "";
  const primary = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  return primary.startsWith("fr") ? "fr" : "en";
}

export async function getTranslations() {
  const locale = await getLocale();
  return { t: translations[locale], locale };
}
