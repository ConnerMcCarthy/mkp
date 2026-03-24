import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { MAX_ANONYMOUS_BODY_LENGTH } from "./anonymous-messages-constants";

const DATA_PATH = path.join(process.cwd(), "data", "anonymous-messages.json");
const MAX_STORED_MESSAGES = 500;

export type AnonymousMessage = {
  id: string;
  body: string;
  createdAt: string;
};

type Store = {
  messages: AnonymousMessage[];
};

async function ensureDataDir(): Promise<void> {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
}

function normalizeMessage(raw: unknown): AnonymousMessage | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.body !== "string" ||
    typeof o.createdAt !== "string"
  ) {
    return null;
  }
  return { id: o.id, body: o.body, createdAt: o.createdAt };
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
  const message: AnonymousMessage = {
    id: crypto.randomUUID(),
    body: trimmed,
    createdAt: new Date().toISOString(),
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
