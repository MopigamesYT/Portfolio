import Image from "next/image";
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowDownIcon } from "./icons";
import { portfolio } from "../constants";
import { fetchDiscordProfile } from "../lib/lanyard";
import ctp from "../lib/ctp";
import HeroWaves from "./hero-waves";
import Activity from "./activity";
import type { Translations } from "../i18n/translations";

type Props = { t: Translations["hero"] };

export default async function Hero({ t }: Props) {
  const { avatar, decoration, accent1, accent2 } = await fetchDiscordProfile();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroWaves />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 py-24 lg:flex-row lg:gap-20 lg:py-32">

        {/* Left: copy */}
        <div className="flex w-full flex-1 flex-col items-center gap-7 lg:items-start">
          <div className="flex flex-col gap-1">
            <p className="text-lg text-ctp-subtext1">{t.greeting}</p>
            <h1 className="text-6xl font-bold leading-none tracking-tight lg:text-8xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accent1} 0%, ${accent2} 55%, ${ctp.pink} 100%)`,
                }}
              >
                {portfolio.name}
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xl font-medium lg:text-2xl" style={{ color: ctp.subtext1 }}>
              {t.role}
            </p>
            <p className="text-xs italic" style={{ color: ctp.overlay0 }}>
              {t.legalNameNote}
            </p>
          </div>

          <p className="max-w-md text-center leading-8 text-ctp-overlay2 lg:text-left">{t.bio}</p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: ctp.mauve, color: ctp.base }}
            >
              {t.viewWork}
              <ArrowDownIcon className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-ctp-surface1"
              style={{
                backgroundColor: ctp.surface0,
                color:           ctp.text,
                border:          `1px solid ${ctp.surface1}`,
              }}
            >
              {t.getInTouch}
            </a>
          </div>

          <div className="flex items-center gap-5 pt-1">
            <a
              href={portfolio.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ctp-overlay1 transition-colors hover:text-ctp-mauve"
              aria-label="GitHub"
            >
              <GitHubIcon className="h-6 w-6" />
            </a>
            <a
              href={portfolio.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ctp-overlay1 transition-colors hover:text-ctp-blue"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="h-6 w-6" />
            </a>
            <a
              href={`mailto:${portfolio.email}`}
              className="text-ctp-overlay1 transition-colors hover:text-ctp-green"
              aria-label="Email"
            >
              <MailIcon className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Right: avatar + activity
            flex-col so Activity is below the ring in normal flow on mobile.
            On desktop: Activity uses lg:absolute so only the ring affects layout. */}
        <div className="relative flex shrink-0 flex-col items-center gap-5 order-first lg:order-last lg:-translate-y-10">

          {/* Conic-gradient ring */}
          <div
            className="relative rounded-full p-[3px]"
            style={{
              background: `conic-gradient(from 0deg, ${accent1}, ${accent2}, ${ctp.pink}, ${ctp.flamingo}, ${accent1})`,
            }}
          >
            {/* Glow inside ring so it doesn't spread over the activity card */}
            <div
              className="absolute inset-0 rounded-full opacity-40 blur-3xl"
              style={{
                background: `radial-gradient(circle, ${accent1}60 0%, ${accent2}30 55%, transparent 100%)`,
              }}
            />

            {/* Avatar area - much smaller on mobile */}
            <div
              className="relative h-32 w-32 overflow-hidden rounded-full lg:h-72 lg:w-72"
              style={{ backgroundColor: ctp.mantle }}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={portfolio.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span
                    className="select-none text-4xl font-bold lg:text-8xl"
                    style={{
                      backgroundImage:      `linear-gradient(135deg, ${accent1}, ${accent2})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor:  "transparent",
                    }}
                  >
                    {portfolio.initials}
                  </span>
                </div>
              )}
            </div>

            {/* Avatar decoration */}
            {decoration && (
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 select-none"
                style={{ width: "128%", height: "128%", transform: "translate(-50%, -50%)" }}
              >
                <Image src={decoration} alt="" fill unoptimized />
              </div>
            )}
          </div>

          {/* Activity: in-flow below ring on mobile; absolutely positioned on desktop */}
          <Activity userId={process.env.DISCORD_USER_ID ?? ""} />
        </div>

      </div>
    </section>
  );
}
