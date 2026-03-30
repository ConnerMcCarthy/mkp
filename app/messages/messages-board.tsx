import type { AnonymousMessage } from "@/lib/anonymous-messages-store";
import { MessageLikeButton } from "./message-like-button";
import { PollBoardCard } from "./poll-board-card";

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
      className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-md ring-1 ring-mkp-navy/5"
      aria-labelledby="public-board-heading"
    >
      <h2
        id="public-board-heading"
        className="text-lg font-semibold text-mkp-ink"
      >
        Public board
      </h2>
      <p className="mt-2 text-sm text-mkp-muted">
        Newest first. Authors stay anonymous. You can post a message or a poll;
        likes and poll votes are simple public counts (no sign-in).
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
              <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
                <p className="text-xs text-mkp-muted">
                  {formatWhen(m.createdAt)}
                </p>
                <MessageLikeButton messageId={m.id} likeCount={m.likes} />
              </div>
              {m.type === "poll" ? (
                <PollBoardCard message={m} />
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-sm text-mkp-ink">
                  {m.body}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
