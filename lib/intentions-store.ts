import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "intentions.json");

export type IntentStatus = "yes" | "no";

export type RsvpRecord = {
  name: string;
  status: IntentStatus;
  updatedAt: string;
};

export type KingRecord = {
  name: string;
  claimedAt: string;
};

export type WeekIntentions = {
  rsvps: RsvpRecord[];
  king: KingRecord | null;
};

export type IntentionsData = {
  weeks: Record<string, WeekIntentions>;
};

async function ensureDataDir(): Promise<void> {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
}

function emptyWeek(): WeekIntentions {
  return { rsvps: [], king: null };
}

export async function readIntentions(): Promise<IntentionsData> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as IntentionsData;
    if (!parsed.weeks || typeof parsed.weeks !== "object") {
      return { weeks: {} };
    }
    return parsed;
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return { weeks: {} };
    }
    throw e;
  }
}

export async function writeIntentions(data: IntentionsData): Promise<void> {
  await ensureDataDir();
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

function rsvpKey(name: string): string {
  return normalizeName(name).toLowerCase();
}

export async function upsertRsvp(
  weekKey: string,
  name: string,
  status: IntentStatus,
): Promise<void> {
  const n = normalizeName(name);
  if (!n || n.length > 80) {
    throw new Error("Invalid name");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekKey)) {
    throw new Error("Invalid week");
  }

  const data = await readIntentions();
  const week = data.weeks[weekKey] ?? emptyWeek();
  const key = rsvpKey(n);
  const nextRsvps = week.rsvps.filter((r) => rsvpKey(r.name) !== key);
  nextRsvps.push({
    name: n,
    status,
    updatedAt: new Date().toISOString(),
  });
  nextRsvps.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  week.rsvps = nextRsvps;
  data.weeks[weekKey] = week;
  await writeIntentions(data);
}

export async function claimKing(
  weekKey: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const n = normalizeName(name);
  if (!n || n.length > 80) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekKey)) {
    return { ok: false, error: "Invalid meeting date." };
  }

  const data = await readIntentions();
  const week = data.weeks[weekKey] ?? emptyWeek();
  if (week.king) {
    return {
      ok: false,
      error: `${week.king.name} is already signed up as King for this evening. Contact a steward if a change is needed.`,
    };
  }
  week.king = { name: n, claimedAt: new Date().toISOString() };
  data.weeks[weekKey] = week;
  await writeIntentions(data);
  return { ok: true };
}

export async function releaseKing(
  weekKey: string,
  secret: string,
): Promise<boolean> {
  const expected = process.env.STEWARD_SECRET;
  if (!expected || secret !== expected) {
    return false;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekKey)) {
    return false;
  }

  const data = await readIntentions();
  const week = data.weeks[weekKey];
  if (!week) {
    return false;
  }
  week.king = null;
  await writeIntentions(data);
  return true;
}

export function getWeekSnapshot(
  data: IntentionsData,
  weekKey: string,
): WeekIntentions {
  return data.weeks[weekKey] ?? emptyWeek();
}
