"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitAnonymousMessage,
  submitAnonymousPoll,
  type SubmitMessageState,
} from "@/app/actions/anonymous-messages";
import {
  MAX_ANONYMOUS_BODY_LENGTH,
  MAX_POLL_OPTION_LENGTH,
  MAX_POLL_QUESTION_LENGTH,
  MIN_POLL_OPTIONS,
} from "@/lib/anonymous-messages-constants";

function SubmitFeedback({ state }: { state: SubmitMessageState | undefined }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <p className="mt-3 text-sm text-mkp-blue" role="status">
        {state.message ?? "Posted."}
      </p>
    );
  }
  return (
    <p className="mt-3 text-sm text-red-700" role="alert">
      {state.error}
    </p>
  );
}

const POLL_OPTION_SLOTS = 6;

export function MessagesForm() {
  const router = useRouter();
  const [postKind, setPostKind] = useState<"text" | "poll">("text");
  const textFormRef = useRef<HTMLFormElement>(null);
  const pollFormRef = useRef<HTMLFormElement>(null);
  const wasTextPending = useRef(false);
  const wasPollPending = useRef(false);

  const [textState, textAction, textPending] = useActionState(
    submitAnonymousMessage,
    undefined as SubmitMessageState | undefined,
  );
  const [pollState, pollAction, pollPending] = useActionState(
    submitAnonymousPoll,
    undefined as SubmitMessageState | undefined,
  );

  useEffect(() => {
    const done = wasTextPending.current && !textPending;
    wasTextPending.current = textPending;
    if (done && textState?.ok) {
      textFormRef.current?.reset();
      router.refresh();
    }
  }, [textPending, textState, router]);

  useEffect(() => {
    const done = wasPollPending.current && !pollPending;
    wasPollPending.current = pollPending;
    if (done && pollState?.ok) {
      pollFormRef.current?.reset();
      router.refresh();
    }
  }, [pollPending, pollState, router]);

  return (
    <section
      className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-md ring-1 ring-mkp-navy/5"
      aria-labelledby="send-anon-heading"
    >
      <h2
        id="send-anon-heading"
        className="text-lg font-semibold text-mkp-ink"
      >
        Post anonymously
      </h2>
      <p className="mt-2 text-sm text-mkp-muted">
        Your name is not collected. Posts appear on the public board above.{" "}
        <strong className="font-medium text-mkp-ink">
          “Anonymous” means no name on the post
        </strong>
        — not technical invisibility. Keep it appropriate for the circle.
      </p>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="text-sm font-medium text-mkp-ink">Post type</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-mkp-ink">
            <input
              type="radio"
              name="postKindUi"
              checked={postKind === "text"}
              onChange={() => setPostKind("text")}
              className="text-mkp-blue focus:ring-mkp-blue"
            />
            Message
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-mkp-ink">
            <input
              type="radio"
              name="postKindUi"
              checked={postKind === "poll"}
              onChange={() => setPostKind("poll")}
              className="text-mkp-blue focus:ring-mkp-blue"
            />
            Poll
          </label>
        </div>
      </fieldset>

      {postKind === "text" ? (
        <form ref={textFormRef} action={textAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="anon-body" className="block text-sm font-medium text-mkp-ink">
              Message
            </label>
            <textarea
              id="anon-body"
              name="body"
              required
              rows={6}
              maxLength={MAX_ANONYMOUS_BODY_LENGTH}
              className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
              placeholder="Share with the group…"
            />
            <p className="mt-1 text-xs text-mkp-muted">
              Up to {MAX_ANONYMOUS_BODY_LENGTH} characters.
            </p>
          </div>
          <button
            type="submit"
            disabled={textPending}
            className="rounded-lg bg-mkp-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-mkp-blue-dark disabled:opacity-60"
          >
            {textPending ? "Posting…" : "Post to public board"}
          </button>
          <SubmitFeedback state={textState} />
        </form>
      ) : (
        <form ref={pollFormRef} action={pollAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="poll-question"
              className="block text-sm font-medium text-mkp-ink"
            >
              Poll question
            </label>
            <textarea
              id="poll-question"
              name="pollQuestion"
              required
              rows={3}
              maxLength={MAX_POLL_QUESTION_LENGTH}
              className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
              placeholder="What do you want to ask?"
            />
            <p className="mt-1 text-xs text-mkp-muted">
              Up to {MAX_POLL_QUESTION_LENGTH} characters.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-mkp-ink">Options</p>
            <p className="mt-1 text-xs text-mkp-muted">
              Fill at least {MIN_POLL_OPTIONS} different lines (empty lines are
              ignored). Up to {POLL_OPTION_SLOTS} options; duplicates are
              skipped.
            </p>
            <ul className="mt-3 space-y-2">
              {Array.from({ length: POLL_OPTION_SLOTS }, (_, i) => (
                <li key={i}>
                  <label htmlFor={`poll-opt-${i}`} className="sr-only">
                    Option {i + 1}
                  </label>
                  <input
                    id={`poll-opt-${i}`}
                    name="option"
                    type="text"
                    maxLength={MAX_POLL_OPTION_LENGTH}
                    className="w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-sm text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
                    placeholder={
                      i < MIN_POLL_OPTIONS
                        ? `Option ${i + 1} (include at least ${MIN_POLL_OPTIONS})`
                        : `Option ${i + 1} (optional)`
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            disabled={pollPending}
            className="rounded-lg bg-mkp-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-mkp-blue-dark disabled:opacity-60"
          >
            {pollPending ? "Posting…" : "Post poll"}
          </button>
          <SubmitFeedback state={pollState} />
        </form>
      )}
    </section>
  );
}
