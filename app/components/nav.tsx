import Image from "next/image";
import { GitHubIcon } from "./icons";
import LanguageSwitcher from "./language-switcher";
import { portfolio } from "../constants";
import ctp from "../lib/ctp";
import { fetchDiscordProfile } from "../lib/lanyard";
import type { Translations, Locale } from "../i18n/translations";

type Props = {
  t:      Translations["nav"];
  locale: Locale;
};

export default async function Nav({ t, locale }: Props) {
  const { avatar } = await fetchDiscordProfile();

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ backgroundColor: `${ctp.base}d9`, borderColor: ctp.surface0 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="group flex items-center gap-3">
          {avatar ? (
            <Image
              src={avatar}
              alt={portfolio.name}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-lg object-cover transition-opacity group-hover:opacity-80"
            />
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-opacity group-hover:opacity-80"
              style={{ backgroundColor: ctp.pink, color: ctp.base }}
            >
              {portfolio.initials}
            </span>
          )}
          <span className="font-semibold text-ctp-text">{portfolio.name}</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {t.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ctp-subtext1 transition-colors hover:text-ctp-mauve"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <a
            href={portfolio.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ctp-subtext1 transition-colors hover:bg-ctp-surface0 hover:text-ctp-text"
          >
            <GitHubIcon className="h-5 w-5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
