export type MoulifyResult = {
  key:               string;
  slug:              string;
  name:              string;
  date:              string;
  passed:            number;
  total:             number;
  moduleCode:        string;
  percentage:        number;
  hasCodingStyleBan: boolean;
  failureFlags:      string[];
};

export type MoulifyTepitech = {
  date:        string;
  score:       number;
  scholarYear: number;
};

export type MoulifyLogtimeEntry = {
  date:         string; // YYYY-MM-DD
  logTime:      number; // seconds
  promoLogTime: number; // seconds
};

const BASE = "https://moulify.mopigames.dev";
const REVALIDATE = 3600;

function authHeaders(): HeadersInit | null {
  const token = process.env.MOULIFY_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

export async function fetchMoulifyProjectCount(): Promise<number> {
  try {
    const headers = authHeaders();
    if (!headers) return 0;
    const res = await fetch(`${BASE}/api/results?page=1&per_page=1`, {
      headers,
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return (data.total as number) ?? 0;
  } catch {
    return 0;
  }
}

export async function fetchMoulifyResults(
  perPage = 100,
): Promise<{ items: MoulifyResult[]; total: number }> {
  try {
    const headers = authHeaders();
    if (!headers) return { items: [], total: 0 };
    const res = await fetch(`${BASE}/api/results?page=1&per_page=${perPage}`, {
      headers,
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return { items: [], total: 0 };
    const data = await res.json();
    return {
      items: (data.results ?? []) as MoulifyResult[],
      total: (data.total as number) ?? 0,
    };
  } catch {
    return { items: [], total: 0 };
  }
}

function parseDuration(s: string): number {
  const m = s.match(/^PT([\d.]+)S$/);
  return m ? Math.round(parseFloat(m[1])) : 0;
}

export async function fetchMoulifyLogtime(): Promise<MoulifyLogtimeEntry[]> {
  try {
    const headers = authHeaders();
    if (!headers) return [];
    const res = await fetch(`${BASE}/api/me/logtime`, {
      headers,
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const data = await res.json() as Array<{ date: string; log_time: string; promo_log_time: string }>;
    return data.map((e) => ({
      date:         e.date,
      logTime:      parseDuration(e.log_time),
      promoLogTime: parseDuration(e.promo_log_time),
    }));
  } catch {
    return [];
  }
}

export async function fetchMoulifyGPA(): Promise<string | null> {
  try {
    const headers = authHeaders();
    if (!headers) return null;
    const res = await fetch(`${BASE}/api/me/roadblocks`, {
      headers,
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.roadblocks?.[0]?.student?.gpa as string) ?? null;
  } catch {
    return null;
  }
}

export async function fetchMoulifyTepitechs(): Promise<MoulifyTepitech[]> {
  try {
    const headers = authHeaders();
    if (!headers) return [];
    const res = await fetch(`${BASE}/api/me/tepitechs`, {
      headers,
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    return (await res.json()) as MoulifyTepitech[];
  } catch {
    return [];
  }
}
