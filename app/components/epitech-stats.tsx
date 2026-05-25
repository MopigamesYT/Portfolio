import SectionHeading from "./section-heading";
import { fetchMoulifyResults, fetchMoulifyTepitechs, fetchMoulifyLogtime } from "../lib/moulify";
import type { MoulifyResult, MoulifyLogtimeEntry } from "../lib/moulify";
import type { Translations } from "../i18n/translations";
import ctp from "../lib/ctp";

type T = Translations["epitech"];

// ── Helpers ────────────────────────────────────────────────────────────────

function resultColor(r: MoulifyResult): string {
  if (r.hasCodingStyleBan) return ctp.red;
  if (r.percentage >= 80)  return ctp.green;
  if (r.percentage >= 60)  return ctp.yellow;
  if (r.percentage >= 40)  return ctp.peach;
  return ctp.red;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({
  value,
  sub,
  label,
  color,
}: {
  value: string;
  sub?:  string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl p-6" style={{ backgroundColor: ctp.surface0 }}>
      <span className="text-4xl font-bold leading-none" style={{ color }}>
        {value}
        {sub && <span className="ml-0.5 text-xl opacity-60">{sub}</span>}
      </span>
      <span className="text-sm" style={{ color: ctp.subtext0 }}>{label}</span>
    </div>
  );
}

function ResultCard({ result: r, t }: { result: MoulifyResult; t: Pick<T, "tests" | "noTests"> }) {
  const color = resultColor(r);

  return (
    <div
      className="relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl p-4 pl-5"
      style={{
        backgroundColor: ctp.surface0,
        boxShadow:       `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${color}22`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: `linear-gradient(180deg, ${color}, ${color}88)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight" style={{ color: ctp.text }}>
            {r.name}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: ctp.overlay1 }}>
            {r.moduleCode} · {fmtDate(r.date)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {r.hasCodingStyleBan && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${ctp.red}20`, color: ctp.red }}
            >
              CS Ban
            </span>
          )}
          {!r.hasCodingStyleBan && (
            <span className="text-xl font-bold leading-none" style={{ color }}>
              {r.percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <p className="mb-1.5 text-xs" style={{ color: ctp.overlay0 }}>
          {r.total > 0 ? `${r.passed} / ${r.total} ${t.tests}` : t.noTests}
        </p>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: ctp.surface1 }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${r.percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

function LogtimeChart({
  days,
  t,
}: {
  days: MoulifyLogtimeEntry[];
  t: Pick<T, "logtimeTitle" | "legendYou" | "legendPromo">;
}) {
  const max = Math.max(...days.flatMap((d) => [d.logTime, d.promoLogTime]), 1);
  const BAR_H = 96;

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: ctp.surface0 }}>
      <p
        className="mb-6 text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: ctp.overlay1 }}
      >
        {t.logtimeTitle}
      </p>
      <div className="flex gap-2">
        {days.map((d) => {
          const userH  = d.logTime      > 0 ? Math.max(Math.round((d.logTime      / max) * BAR_H), 4) : 0;
          const promoH = d.promoLogTime > 0 ? Math.max(Math.round((d.promoLogTime / max) * BAR_H), 4) : 0;
          const hours  = (d.logTime / 3600).toFixed(1);
          const dayNum = new Date(d.date + "T12:00:00Z").getUTCDate().toString();

          return (
            <div
              key={d.date}
              className="flex flex-1 flex-col items-center gap-1"
              title={`${d.date}: ${hours}h`}
            >
              {/* Hours above the pair */}
              <span
                className="text-[9px] leading-none"
                style={{ color: ctp.subtext0, minHeight: "11px" }}
              >
                {d.logTime > 0 ? `${hours}h` : ""}
              </span>

              {/* Side-by-side bars */}
              <div className="flex w-full items-end gap-0.5" style={{ height: BAR_H + "px" }}>
                <div
                  className="flex-1 rounded-sm"
                  style={{ height: userH  > 0 ? userH  + "px" : "0", backgroundColor: ctp.sapphire }}
                />
                <div
                  className="flex-1 rounded-sm"
                  style={{ height: promoH > 0 ? promoH + "px" : "0", backgroundColor: ctp.lavender, opacity: 0.55 }}
                />
              </div>

              {/* Day-of-month label */}
              <span className="text-[9px] leading-none" style={{ color: ctp.overlay0 }}>
                {dayNum}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: ctp.sapphire }} />
          <span className="text-xs" style={{ color: ctp.overlay1 }}>{t.legendYou}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: ctp.lavender, opacity: 0.55 }} />
          <span className="text-xs" style={{ color: ctp.overlay1 }}>{t.legendPromo}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default async function EpitechStats({ t }: { t: T }) {
  const [{ items, total }, tepitechs, logtime] = await Promise.all([
    fetchMoulifyResults(100),
    fetchMoulifyTepitechs(),
    fetchMoulifyLogtime(),
  ]);

  if (items.length === 0 && tepitechs.length === 0) return null;

  const avgPct =
    items.length > 0
      ? Math.round(items.reduce((s, r) => s + r.percentage, 0) / items.length)
      : null;

  const latestTepitech = tepitechs.at(-1) ?? null;
  const recent         = items.slice(0, 6);

  const totalHours =
    logtime.length > 0
      ? Math.round(logtime.reduce((s, e) => s + e.logTime, 0) / 3600)
      : null;
  const last14 = logtime.slice(-14);

  return (
    <section id="epitech" className="py-28" style={{ backgroundColor: ctp.base }}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard value={String(total)}  label={t.projectsDelivered} color={ctp.pink} />
          {avgPct !== null && (
            <StatCard
              value={`${avgPct}%`}
              label={t.avgPassRate}
              color={avgPct >= 70 ? ctp.green : avgPct >= 50 ? ctp.yellow : ctp.red}
            />
          )}
          {latestTepitech && (
            <StatCard value={String(latestTepitech.score)} sub="/990" label={t.tepitechScore} color={ctp.blue} />
          )}
          {totalHours !== null && (
            <StatCard value={`${totalHours}h`} label={t.campusHours} color={ctp.sapphire} />
          )}
        </div>

        {/* Recent results */}
        {recent.length > 0 && (
          <div className="mt-16">
            <h3
              className="mb-6 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: ctp.overlay1 }}
            >
              {t.recentDeliveries}
            </h3>
            <div className="grid gap-3 lg:grid-cols-2">
              {recent.map((r) => (
                <ResultCard key={r.key} result={r} t={t} />
              ))}
            </div>
          </div>
        )}

        {/* Logtime chart */}
        {last14.length > 0 && (
          <div className="mt-8">
            <LogtimeChart days={last14} t={t} />
          </div>
        )}
      </div>
    </section>
  );
}
