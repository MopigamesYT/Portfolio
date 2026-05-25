"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ctp from "../lib/ctp";

// ── Types ──────────────────────────────────────────────────────────────────

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

type LanyardSpotify = {
  song:          string;
  artist:        string;
  album:         string;
  album_art_url: string;
  track_id:      string;
  timestamps:    { start: number; end: number };
};

type LanyardActivity = {
  type:            0 | 1 | 2 | 3 | 4 | 5;
  name:            string;
  details?:        string;
  state?:          string;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?:  string;
    small_image?: string;
    small_text?:  string;
  };
  timestamps?: { start?: number; end?: number };
  emoji?: { name: string; id?: string; animated?: boolean };
};

type LanyardPresence = {
  discord_status:       DiscordStatus;
  listening_to_spotify: boolean;
  spotify:              LanyardSpotify | null;
  activities:           LanyardActivity[];
};

type Slide =
  | { kind: "game";    activity: LanyardActivity }
  | { kind: "spotify"; spotify:  LanyardSpotify   };

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<DiscordStatus, string> = {
  online:  ctp.green,
  idle:    ctp.yellow,
  dnd:     ctp.red,
  offline: ctp.overlay1,
};

const STATUS_LABEL: Record<DiscordStatus, string> = {
  online:  "Online",
  idle:    "Away",
  dnd:     "Do Not Disturb",
  offline: "Offline",
};

function activityImgUrl(a: LanyardActivity): string | null {
  const img = a.assets?.large_image;
  if (!img) return null;
  if (img.startsWith("mp:external/"))
    return "https://media.discordapp.net/" + img.slice("mp:".length);
  if (img.startsWith("https://") || img.startsWith("http://")) return img;
  if (a.application_id)
    return `https://cdn.discordapp.com/app-assets/${a.application_id}/${img}.png`;
  return null;
}

function fmtMs(ms: number): string {
  const s = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Dot({ status }: { status: DiscordStatus }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: STATUS_COLOR[status] }}
    />
  );
}

function SpotifyProgress({ ts }: { ts: LanyardSpotify["timestamps"] }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsed  = Math.max(0, now - ts.start);
  const total    = ts.end - ts.start;
  const progress = Math.min(1, elapsed / total);
  return (
    <div className="flex flex-col gap-1">
      <div className="h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: ctp.surface1 }}>
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress * 100}%`, backgroundColor: ctp.green }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: ctp.overlay1 }}>
        <span>{fmtMs(elapsed)}</span>
        <span>{fmtMs(total)}</span>
      </div>
    </div>
  );
}

function LiveElapsed({ start }: { start: number }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return <>{fmtMs(now - start)} elapsed</>;
}

// ── Shared card style ──────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  backgroundColor: `${ctp.mantle}f0`,
  border:          `1px solid ${ctp.surface1}`,
  backdropFilter:  "blur(12px)",
};

// ── Slide content ──────────────────────────────────────────────────────────

function SlideContent({ slide, status }: { slide: Slide; status: DiscordStatus }) {
  if (slide.kind === "game") {
    const { activity: game } = slide;
    const imgUrl = activityImgUrl(game);
    return (
      <>
        <header className="mb-2.5 flex items-center gap-2">
          <Dot status={status} />
          <span className="text-xs font-semibold tracking-wide" style={{ color: STATUS_COLOR[status] }}>
            Playing
          </span>
        </header>
        <div className="flex gap-2.5">
          {imgUrl ? (
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md lg:h-12 lg:w-12 lg:rounded-lg">
              <Image src={imgUrl} alt={game.assets?.large_text ?? game.name} fill unoptimized className="object-cover" />
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-lg lg:h-12 lg:w-12 lg:rounded-lg lg:text-xl" style={{ backgroundColor: ctp.surface0 }}>
              🎮
            </div>
          )}
          <div className="flex min-w-0 flex-col justify-center gap-0.5">
            <p className="truncate text-sm font-semibold" style={{ color: ctp.text }}>{game.name}</p>
            {game.details && <p className="truncate text-xs" style={{ color: ctp.subtext1 }}>{game.details}</p>}
            {game.state && <p className="truncate text-xs" style={{ color: ctp.subtext1 }}>{game.state}</p>}
            {game.timestamps?.start != null && (
              <p className="text-xs" style={{ color: ctp.overlay1 }}>
                <LiveElapsed start={game.timestamps.start} />
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  const { spotify } = slide;
  return (
    <>
      <header className="mb-2.5 flex items-center gap-2">
        <Dot status={status} />
        <span className="text-xs font-semibold tracking-wide" style={{ color: STATUS_COLOR[status] }}>
          Listening to Spotify
        </span>
      </header>
      <div className="flex gap-2.5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md lg:h-12 lg:w-12 lg:rounded-lg">
          <Image src={spotify.album_art_url} alt={spotify.album} fill unoptimized className="object-cover" />
        </div>
        <div className="flex min-w-0 flex-col justify-center gap-0.5">
          <p className="truncate text-sm font-semibold" style={{ color: ctp.text }}>{spotify.song}</p>
          <p className="truncate text-xs" style={{ color: ctp.subtext1 }}>{spotify.artist}</p>
        </div>
      </div>
      <SpotifyProgress ts={spotify.timestamps} />
    </>
  );
}

// ── Deck (cycling card stack) ──────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes card-leave {
    from { transform: none; opacity: 1; }
    to   { transform: translateY(10px) scale(0.94); opacity: 0; }
  }
  @keyframes card-enter {
    from { transform: translateY(-10px) scale(0.97); opacity: 0; }
    to   { transform: none; opacity: 1; }
  }
`;

function DeckCard({ slides, status }: { slides: Slide[]; status: DiscordStatus }) {
  const [idx, setIdx]         = useState(0);
  const [exitIdx, setExitIdx] = useState<number | null>(null);
  const idxRef      = useRef(idx);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  idxRef.current = idx;

  const safeIdx = idx % slides.length;
  const backIdx = (safeIdx + 1) % slides.length;

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      const cur = idxRef.current % slides.length;
      setExitIdx(cur);
      setIdx((cur + 1) % slides.length);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      exitTimerRef.current = setTimeout(() => setExitIdx(null), 520);
    }, 5000);
    return () => {
      clearInterval(id);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [slides.length]);

  return (
    <div className="relative w-74" style={{ isolation: "isolate" }}>
      <style>{KEYFRAMES}</style>

      {/* Back card — peeks behind the front card */}
      {slides.length > 1 && (
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            ...CARD,
            transform:     "translate(6px, 9px) scale(0.95)",
            opacity:       0.65,
            zIndex:        1,
            pointerEvents: "none",
          }}
        >
          <div className="flex flex-col gap-3 p-3.5">
            <SlideContent slide={slides[backIdx]} status={status} />
          </div>
        </div>
      )}

      {/* Exiting card — flies off upward */}
      {exitIdx !== null && (
        <div
          key={`exit-${exitIdx}`}
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            ...CARD,
            zIndex:        3,
            animation:     "card-leave 380ms ease-out forwards",
            pointerEvents: "none",
          }}
        >
          <div className="flex flex-col gap-3 p-3.5">
            <SlideContent slide={slides[exitIdx % slides.length]} status={status} />
          </div>
        </div>
      )}

      {/* Front card — active, enters from slightly below */}
      <div
        key={`front-${safeIdx}`}
        className="relative rounded-2xl"
        style={{ ...CARD, zIndex: 2, animation: "card-enter 400ms ease-out" }}
      >
        <div className="flex flex-col gap-3 p-3.5">
          <SlideContent slide={slides[safeIdx]} status={status} />
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Activity({ userId }: { userId: string }) {
  const [presence, setPresence]  = useState<LanyardPresence | null>(null);
  const wsRef        = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId) return;
    let alive = true;

    const connect = () => {
      if (!alive) return;
      const ws = new WebSocket("wss://api.lanyard.rest/socket");
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data as string);
        if (msg.op === 1) {
          heartbeatRef.current = setInterval(
            () => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ op: 3 })),
            msg.d.heartbeat_interval,
          );
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        }
        if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
          setPresence(msg.d);
        }
      };

      ws.onclose = () => {
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        if (alive) setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();
    };

    connect();
    return () => {
      alive = false;
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      wsRef.current?.close();
    };
  }, [userId]);

  if (!presence || presence.discord_status === "offline") return null;

  const { discord_status, listening_to_spotify, spotify, activities } = presence;
  const game   = activities.find((a) => a.type === 0);
  const custom = activities.find((a) => a.type === 4);

  const slides: Slide[] = [];
  if (game) slides.push({ kind: "game", activity: game });
  if (listening_to_spotify && spotify) slides.push({ kind: "spotify", spotify });

  // ── Activity deck (game / spotify / both) ─────────────────────────────────
  if (slides.length > 0) {
    return (
      <div className="hidden lg:absolute lg:left-1/2 lg:top-full lg:mt-14 lg:block lg:-translate-x-1/2 lg:z-20">
        <DeckCard slides={slides} status={discord_status} />
      </div>
    );
  }

  // ── Status pill: bottom-right of avatar ───────────────────────────────────
  const label = custom
    ? `${custom.emoji?.name ? custom.emoji.name + " " : ""}${custom.state ?? ""}`.trim()
    : STATUS_LABEL[discord_status];

  return (
    <div
      className="relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs lg:absolute lg:bottom-3 lg:right-3 lg:z-20"
      style={CARD}
    >
      <Dot status={discord_status} />
      <span style={{ color: ctp.subtext1 }}>{label}</span>
    </div>
  );
}
