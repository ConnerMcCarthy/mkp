"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitAnonymousMessage, type SubmitMessageState } from "@/app/actions/anonymous-messages";
import { MAX_ANONYMOUS_BODY_LENGTH } from "@/lib/anonymous-messages-constants";

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

export function MessagesForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);
  const [messageState, messageAction, messagePending] = useActionState(
    submitAnonymousMessage,
    undefined as SubmitMessageState | undefined,
  );

  useEffect(() => {
    const finishedSubmit = wasPending.current && !messagePending;
    wasPending.current = messagePending;
    if (finishedSubmit && messageState?.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [messagePending, messageState, router]);

  return (
    <section
      className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-sm"
      aria-labelledby="send-anon-heading"
    >
      <h2
        id="send-anon-heading"
        className="text-lg font-semibold text-mkp-ink"
      >
        Post anonymously
      </h2>
      <p className="mt-2 text-sm text-mkp-muted">
        Your name is not collected. The message text appears on the public
        board above for everyone.{" "}
        <strong className="font-medium text-mkp-ink">
          “Anonymous” here means no name on the post
        </strong>
        — not technical invisibility. Keep it appropriate for the circle.
      </p>

      <form ref={formRef} action={messageAction} className="mt-6 space-y-4">
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
          disabled={messagePending}
          className="rounded-lg bg-mkp-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-mkp-blue-dark disabled:opacity-60"
        >
          {messagePending ? "Posting…" : "Post to public board"}
        </button>
        <SubmitFeedback state={messageState} />
      </form>
    </section>
  );
}
