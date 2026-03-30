"use client";

type Segment = { kind: "text" | "url"; value: string };

function splitUrlSegments(text: string): Segment[] {
  const urlPattern = /https?:\/\/[^\s<]+/gi;
  const segments: Segment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(urlPattern)) {
    const raw = match[0];
    const start = match.index ?? 0;
    if (start > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, start) });
    }
    segments.push({ kind: "url", value: raw });
    lastIndex = start + raw.length;
  }
  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }
  if (segments.length === 0) {
    segments.push({ kind: "text", value: text });
  }
  return segments;
}

/** Strip common trailing characters that aren’t part of the URL. */
function trimUrlSuffix(raw: string): string {
  return raw.replace(/[.,;:!?)\]>'"»]+$/u, "");
}

function safeHttpHref(raw: string): string | null {
  const candidate = trimUrlSuffix(raw);
  try {
    const u = new URL(candidate);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return u.href;
    }
  } catch {
    return null;
  }
  return null;
}

const linkClass =
  "break-all text-mkp-blue underline underline-offset-2 hover:underline";

type Props = {
  text: string;
};

/** Plain text with http(s) URLs turned into external links. */
export function LinkifyText({ text }: Props) {
  const parts = splitUrlSegments(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === "text") {
          return <span key={i}>{p.value}</span>;
        }
        const href = safeHttpHref(p.value);
        if (!href) {
          return <span key={i}>{p.value}</span>;
        }
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {p.value}
          </a>
        );
      })}
    </>
  );
}
