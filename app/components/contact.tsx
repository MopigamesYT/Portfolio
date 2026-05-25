import type { ComponentType } from "react";
import SectionHeading from "./section-heading";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { portfolio } from "../constants";
import ctp from "../lib/ctp";
import type { Translations } from "../i18n/translations";

type Props = { t: Translations["contact"] };

type SocialLink = {
  href:       string;
  label:      string;
  Icon:       ComponentType<{ className?: string }>;
  hoverClass: string;
};

const socialLinks: SocialLink[] = [
  { href: portfolio.githubUrl,   label: "GitHub",   Icon: GitHubIcon,   hoverClass: "hover:text-ctp-mauve" },
  { href: portfolio.linkedinUrl, label: "LinkedIn", Icon: LinkedInIcon, hoverClass: "hover:text-ctp-blue"  },
];

export default function Contact({ t }: Props) {
  return (
    <section id="contact" className="py-28" style={{ backgroundColor: ctp.mantle }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} centered />

          <p className="mx-auto mt-8 max-w-lg leading-8 text-ctp-subtext1">{t.body}</p>

          <a
            href={`mailto:${portfolio.email}`}
            className="mt-12 inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: ctp.pink, color: ctp.base }}
          >
            <MailIcon className="h-5 w-5" />
            {t.cta}
          </a>

          <div className="mt-10 flex items-center gap-4">
            {socialLinks.map(({ href, label, Icon, hoverClass }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-ctp-surface0 text-ctp-overlay1 transition-colors hover:bg-ctp-surface1 ${hoverClass}`}
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
