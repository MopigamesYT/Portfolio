import ctp from "./ctp";

export type DiscordProfile = {
  avatar:     string | null;
  decoration: string | null;
  accent1:    string;
  accent2:    string;
};

// Only accent-range Catppuccin colors are candidates - skip backgrounds/surfaces/text
const ACCENT_PALETTE: string[] = [
  ctp.rosewater, ctp.flamingo, ctp.pink,    ctp.mauve,
  ctp.red,       ctp.maroon,   ctp.peach,   ctp.yellow,
  ctp.green,     ctp.teal,     ctp.sky,     ctp.sapphire,
  ctp.blue,      ctp.lavender,
];

function closestCtp(decimal: number): string {
  const r1 = (decimal >> 16) & 0xff;
  const g1 = (decimal >> 8)  & 0xff;
  const b1 =  decimal        & 0xff;
  let best = ctp.pink as string;
  let min  = Infinity;
  for (const hex of ACCENT_PALETTE) {
    const r2 = parseInt(hex.slice(1, 3), 16);
    const g2 = parseInt(hex.slice(3, 5), 16);
    const b2 = parseInt(hex.slice(5, 7), 16);
    const d  = (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
    if (d < min) { min = d; best = hex; }
  }
  return best;
}

function discordExt(hash: string) {
  return hash.startsWith("a_") ? "gif" : "png";
}

const DEFAULTS: DiscordProfile = {
  avatar:     null,
  decoration: null,
  accent1:    ctp.maroon,
  accent2:    ctp.pink,
};

export async function fetchDiscordProfile(): Promise<DiscordProfile> {
  const token  = process.env.DISCORD_BOT_TOKEN;
  const userId = process.env.DISCORD_USER_ID;
  if (!token || !userId) return DEFAULTS;

  try {
    const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: { Authorization: `Bot ${token}` },
      next:    { revalidate: 300 },
    });
    if (!res.ok) return DEFAULTS;

    const user = await res.json();

    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${discordExt(user.avatar)}?size=512`
      : null;

    const decoration = user.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=256`
      : null;

    const rawColors: number[] = user.display_name_styles?.colors ?? [];
    const accent1 = rawColors[0] != null ? closestCtp(rawColors[0]) : DEFAULTS.accent1;
    const accent2 = rawColors[1] != null ? closestCtp(rawColors[1]) : DEFAULTS.accent2;

    return { avatar, decoration, accent1, accent2 };
  } catch {
    return DEFAULTS;
  }
}
