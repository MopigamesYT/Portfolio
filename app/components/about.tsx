import SectionHeading from "./section-heading";
import { stats, experienceStart } from "../constants";
import ctp from "../lib/ctp";
import { fetchPublicRepoCount } from "../lib/github";
import { fetchMoulifyProjectCount } from "../lib/moulify";
import type { Translations } from "../i18n/translations";

type Props = { t: Translations["about"] };

export default async function About({ t }: Props) {
  const [repoCount, epitechCount] = await Promise.all([
    fetchPublicRepoCount(),
    fetchMoulifyProjectCount(),
  ]);

  const start = new Date(experienceStart);
  const now   = new Date();
  let years   = now.getFullYear() - start.getFullYear();
  if (
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())
  ) years--;

  const liveStats = stats.map((s, i) => {
    if (i === 0)                  return { ...s, value: `${years}+` };
    if (i === 1 && epitechCount > 0) return { ...s, value: String(epitechCount) };
    if (i === 2 && repoCount > 0) return { ...s, value: String(repoCount) };
    return s;
  });
  return (
    <section id="about" className="py-28" style={{ backgroundColor: ctp.mantle }}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6 leading-8 text-ctp-subtext1">
            {t.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {liveStats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-2xl p-6"
                style={{ backgroundColor: ctp.surface0 }}
              >
                <span className="text-4xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-sm" style={{ color: ctp.subtext0 }}>
                  {t.stats[i].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
