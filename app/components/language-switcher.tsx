"use client";

import { useRouter } from "next/navigation";
import { setLocaleCookie } from "../i18n/actions";
import type { Locale } from "../i18n/translations";
import ctp from "../lib/ctp";

const labels: Record<Locale, string> = { en: "EN", fr: "FR" };
const locales: Locale[] = ["en", "fr"];

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  async function switchTo(next: Locale) {
    await setLocaleCookie(next);
    router.refresh();
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg p-1"
      style={{ backgroundColor: ctp.surface0 }}
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className="rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-all"
          style={
            locale === l
              ? { backgroundColor: ctp.mauve, color: ctp.base }
              : { color: ctp.overlay1 }
          }
          aria-pressed={locale === l}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
