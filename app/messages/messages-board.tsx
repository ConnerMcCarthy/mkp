import type { AnonymousMessage } from "@/lib/anonymous-messages-store";

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  messages: AnonymousMessage[];
};

export function MessagesBoard({ messages }: Props) {
  return (
    <section
      className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-sm"
      aria-labelledby="public-board-heading"
    >
      <h2
        id="public-board-heading"
        className="text-lg font-semibold text-mkp-ink"
      >
        Public board
      </h2>
      <p className="mt-2 text-sm text-mkp-muted">
        Newest first. Authors stay anonymous; the text is visible to anyone who
        visits this page.
      </p>

      {messages.length === 0 ? (
        <p className="mt-6 text-sm text-mkp-muted">No messages yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border border-mkp-border bg-mkp-surface-subtle p-4"
            >
              <p className="text-xs text-mkp-muted">{formatWhen(m.createdAt)}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-mkp-ink">
                {m.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
