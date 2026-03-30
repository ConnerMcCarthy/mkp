import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  MAX_ANONYMOUS_BODY_LENGTH,
  MAX_POLL_OPTION_LENGTH,
  MAX_POLL_QUESTION_LENGTH,
  MAX_POLL_OPTIONS,
  MIN_POLL_OPTIONS,
} from "./anonymous-messages-constants";

const DATA_PATH = path.join(process.cwd(), "data", "anonymous-messages.json");
const MAX_STORED_MESSAGES = 500;

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type AnonymousTextMessage = {
  type: "text";
  id: string;
  body: string;
  createdAt: string;
  likes: number;
};

export type AnonymousPollMessage = {
  type: "poll";
  id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  likes: number;
};

export type AnonymousMessage = AnonymousTextMessage | AnonymousPollMessage;

type Store = {
  messages: AnonymousMessage[];
};

async function ensureDataDir(): Promise<void> {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
}

function normalizeLikes(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.min(Math.floor(value), 1_000_000);
}

function normalizePollOptions(raw: unknown): PollOption[] | null {
  if (!Array.isArray(raw)) return null;
  const out: PollOption[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.label !== "string") continue;
    const label = o.label.trim().slice(0, MAX_POLL_OPTION_LENGTH);
    if (!label) continue;
    out.push({
      id: o.id,
      label,
      votes: normalizeLikes(o.votes),
    });
  }
  if (out.length < MIN_POLL_OPTIONS) return null;
  if (out.length > MAX_POLL_OPTIONS) {
    return out.slice(0, MAX_POLL_OPTIONS);
  }
  return out;
}

function normalizeMessage(raw: unknown): AnonymousMessage | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.createdAt !== "string") {
    return null;
  }

  if (o.type === "poll") {
    if (typeof o.question !== "string") return null;
    const options = normalizePollOptions(o.options);
    if (!options) return null;
    const question = o.question.trim().slice(0, MAX_POLL_QUESTION_LENGTH);
    if (!question) return null;
    return {
      type: "poll",
      id: o.id,
      question,
      options,
      createdAt: o.createdAt,
      likes: normalizeLikes(o.likes),
    };
  }

  if (typeof o.body !== "string") return null;
  return {
    type: "text",
    id: o.id,
    body: o.body,
    createdAt: o.createdAt,
    likes: normalizeLikes(o.likes),
  };
}

export async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as { messages?: unknown[] };
    if (!Array.isArray(parsed.messages)) {
      return { messages: [] };
    }
    const messages = parsed.messages
      .map(normalizeMessage)
      .filter((m): m is AnonymousMessage => m !== null);
    return { messages };
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return { messages: [] };
    }
    throw e;
  }
}

async function writeStore(data: Store): Promise<void> {
  await ensureDataDir();
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function addAnonymousMessage(body: string): Promise<void> {
  const trimmed = body.trim().replace(/\r\n/g, "\n");
  if (!trimmed || trimmed.length > MAX_ANONYMOUS_BODY_LENGTH) {
    throw new Error("Invalid message");
  }

  const data = await readStore();
  const message: AnonymousTextMessage = {
    type: "text",
    id: crypto.randomUUID(),
    body: trimmed,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  data.messages.unshift(message);
  if (data.messages.length > MAX_STORED_MESSAGES) {
    data.messages = data.messages.slice(0, MAX_STORED_MESSAGES);
  }
  await writeStore(data);
}

function normalizePollLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of labels) {
    const t = raw.trim().replace(/\r\n/g, "\n").slice(0, MAX_POLL_OPTION_LENGTH);
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= MAX_POLL_OPTIONS) break;
  }
  return out;
}

export async function addAnonymousPoll(
  question: string,
  optionLabels: string[],
): Promise<void> {
  const q = question.trim().replace(/\r\n/g, "\n").slice(0, MAX_POLL_QUESTION_LENGTH);
  if (!q) {
    throw new Error("Invalid poll question");
  }
  const labels = normalizePollLabels(optionLabels);
  if (labels.length < MIN_POLL_OPTIONS) {
    throw new Error("Poll needs at least two distinct options");
  }

  const data = await readStore();
  const message: AnonymousPollMessage = {
    type: "poll",
    id: crypto.randomUUID(),
    question: q,
    options: labels.map((label) => ({
      id: crypto.randomUUID(),
      label,
      votes: 0,
    })),
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  data.messages.unshift(message);
  if (data.messages.length > MAX_STORED_MESSAGES) {
    data.messages = data.messages.slice(0, MAX_STORED_MESSAGES);
  }
  await writeStore(data);
}

/** Newest first — visible to everyone on the site. */
export async function listPublicMessagesNewestFirst(): Promise<AnonymousMessage[]> {
  const data = await readStore();
  return [...data.messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function incrementMessageLike(messageId: string): Promise<number> {
  const id = messageId.trim();
  if (!id) {
    throw new Error("Invalid message id");
  }

  const data = await readStore();
  const idx = data.messages.findIndex((m) => m.id === id);
  if (idx === -1) {
    throw new Error("Message not found");
  }

  const msg = data.messages[idx];
  const nextLikes = msg.likes + 1;
  data.messages[idx] = { ...msg, likes: nextLikes };
  await writeStore(data);
  return nextLikes;
}

export async function incrementPollVote(
  messageId: string,
  optionId: string,
): Promise<PollOption[]> {
  const mid = messageId.trim();
  const oid = optionId.trim();
  if (!mid || !oid) {
    throw new Error("Invalid ids");
  }

  const data = await readStore();
  const idx = data.messages.findIndex((m) => m.id === mid);
  if (idx === -1) {
    throw new Error("Message not found");
  }

  const msg = data.messages[idx];
  if (msg.type !== "poll") {
    throw new Error("Not a poll");
  }

  const optIdx = msg.options.findIndex((o) => o.id === oid);
  if (optIdx === -1) {
    throw new Error("Option not found");
  }

  const nextOptions = msg.options.map((o, i) =>
    i === optIdx ? { ...o, votes: o.votes + 1 } : o,
  );
  data.messages[idx] = { ...msg, options: nextOptions };
  await writeStore(data);
  return nextOptions;
}
