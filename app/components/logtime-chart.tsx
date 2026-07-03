"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import ctp from "../lib/ctp";
import type { MoulifyLogtimeEntry } from "../lib/moulify";
import type { Translations } from "../i18n/translations";

type T = Pick<Translations["epitech"], "logtimeTitle" | "legendYou" | "legendPromo">;

const BAR_H = 96;

const fmtHours = (seconds: number) => `${(seconds / 3600).toFixed(1)}h`;

function fmtDay(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
  });
}

function TooltipRow({ color, label, value, dim }: { color: string; label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-5 text-xs">
      <span className="flex items-center gap-1.5" style={{ color: ctp.subtext0 }}>
        <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color, opacity: dim ? 0.55 : 1 }} />
        {label}
      </span>
      <span className="font-semibold tabular-nums" style={{ color: ctp.text }}>
        {value}
      </span>
    </div>
  );
}

export default function LogtimeChart({ days, t }: { days: MoulifyLogtimeEntry[]; t: T }) {
  const [hovered, setHovered] = useState<number | null>(null);
  // Remembers the last hovered day so the tooltip keeps its content while fading out
  const [lastShown, setLastShown] = useState(0);
  const [tipLeft, setTipLeft] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const tipDay = days[hovered ?? lastShown];
  const active = hovered !== null;

  const max = Math.max(...days.flatMap((d) => [d.logTime, d.promoLogTime]), 1);

  // Map a pointer position to a column, covering the gaps between bars too
  const hoverFromX = (clientX: number) => {
    const rect = rowRef.current!.getBoundingClientRect();
    const i = Math.floor(((clientX - rect.left) / rect.width) * days.length);
    const clamped = Math.min(Math.max(i, 0), days.length - 1);
    setHovered(clamped);
    setLastShown(clamped);
  };

  // Follow the hovered column, clamped so the tooltip never leaves the card
  useLayoutEffect(() => {
    if (hovered === null || !rowRef.current || !tipRef.current) return;
    const rowW   = rowRef.current.clientWidth;
    const tipW   = tipRef.current.offsetWidth;
    const center = ((hovered + 0.5) / days.length) * rowW;
    setTipLeft(Math.round(Math.min(Math.max(center - tipW / 2, 0), Math.max(rowW - tipW, 0))));
  }, [hovered, days.length]);

  // On touch the tooltip stays open after the finger lifts — dismiss it by
  // tapping anywhere outside the chart
  useEffect(() => {
    if (hovered === null) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (!rowRef.current?.contains(e.target as Node)) setHovered(null);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [hovered]);

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: ctp.surface0 }}>
      <p
        className="mb-6 text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: ctp.overlay1 }}
      >
        {t.logtimeTitle}
      </p>

      <div className="relative">
        {/* Tooltip — one per chart, slides between columns */}
        <div
          ref={tipRef}
          className="pointer-events-none absolute bottom-full z-10 mb-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left"
          style={{
            left:            tipLeft,
            backgroundColor: `${ctp.mantle}f5`,
            border:          `1px solid ${ctp.surface1}`,
            boxShadow:       "0 8px 24px rgba(0,0,0,0.45)",
            backdropFilter:  "blur(8px)",
            opacity:         active ? 1 : 0,
            transform:       active ? "translateY(0)" : "translateY(6px)",
            transition:      "opacity 0.2s ease, transform 0.25s var(--ease-out-soft), left 0.15s ease-out",
          }}
        >
          <p className="mb-1.5 text-xs font-semibold" style={{ color: ctp.text }}>
            {fmtDay(tipDay.date)}
          </p>
          <div className="flex flex-col gap-1">
            <TooltipRow color={ctp.sapphire} label={t.legendYou}   value={fmtHours(tipDay.logTime)} />
            <TooltipRow color={ctp.lavender} label={t.legendPromo} value={fmtHours(tipDay.promoLogTime)} dim />
          </div>
        </div>

        {/* One pointer surface for the whole row: mouse hover, touch tap and
            finger scrubbing all land here; pan-y keeps page scroll working */}
        <div
          ref={rowRef}
          className="flex select-none gap-2"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => hoverFromX(e.clientX)}
          onPointerMove={(e) => hoverFromX(e.clientX)}
          onPointerLeave={(e) => { if (e.pointerType === "mouse") setHovered(null); }}
        >
          {days.map((d, i) => {
            const userH  = d.logTime      > 0 ? Math.max(Math.round((d.logTime      / max) * BAR_H), 4) : 0;
            const promoH = d.promoLogTime > 0 ? Math.max(Math.round((d.promoLogTime / max) * BAR_H), 4) : 0;
            const dayNum = new Date(d.date + "T12:00:00Z").getUTCDate().toString();

            const isActive = hovered === i;
            const dimmed   = hovered !== null && !isActive;

            return (
              <div
                key={d.date}
                className="flex flex-1 cursor-default flex-col items-center gap-1 rounded-md"
                style={{
                  backgroundColor: isActive ? `${ctp.surface1}59` : "transparent",
                  transition:      "background-color 0.25s ease",
                }}
              >
                {/* Hours above the pair */}
                <span
                  className="text-[9px] leading-none"
                  style={{
                    color:      isActive ? ctp.text : ctp.subtext0,
                    minHeight:  "11px",
                    transition: "color 0.2s ease",
                  }}
                >
                  {d.logTime > 0 ? fmtHours(d.logTime) : ""}
                </span>

                {/* Side-by-side bars — grow up on reveal, spotlight on hover */}
                <div
                  className="flex w-full items-end gap-0.5"
                  style={{
                    height:     BAR_H + "px",
                    opacity:    dimmed ? 0.35 : 1,
                    filter:     isActive ? "brightness(1.15)" : "none",
                    transition: "opacity 0.25s ease, filter 0.25s ease",
                  }}
                >
                  <div
                    className="grow-y flex-1 rounded-sm"
                    style={{ height: userH  > 0 ? userH  + "px" : "0", backgroundColor: ctp.sapphire, "--grow-delay": `${i * 35}ms` } as CSSProperties}
                  />
                  <div
                    className="grow-y flex-1 rounded-sm"
                    style={{ height: promoH > 0 ? promoH + "px" : "0", backgroundColor: ctp.lavender, opacity: 0.55, "--grow-delay": `${i * 35 + 80}ms` } as CSSProperties}
                  />
                </div>

                {/* Day-of-month label */}
                <span
                  className="text-[9px] leading-none"
                  style={{ color: isActive ? ctp.subtext1 : ctp.overlay0, transition: "color 0.2s ease" }}
                >
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>
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
