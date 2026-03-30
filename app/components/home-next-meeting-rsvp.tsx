"use client";

import { useActionState } from "react";
import { submitIntention, type FormState } from "@/app/actions/intentions";

type Props = {
  weekKey: string;
};

const initialFormState: FormState | undefined = undefined;

function Message({ state }: { state: FormState | undefined }) {
  if (!state) return null;
  if (state.ok) {
    return state.message ? (
      <p className="mt-2 text-sm text-mkp-blue" role="status">
        {state.message}
      </p>
    ) : (
      <p className="mt-2 text-sm text-mkp-blue" role="status">
        Saved.
      </p>
    );
  }
  return (
    <p className="mt-2 text-sm text-mkp-red" role="alert">
      {state.error}
    </p>
  );
}

const yesNoBtn =
  "min-h-[3.75rem] rounded-xl border-2 px-3 py-4 text-center text-sm font-semibold leading-snug transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

export function HomeNextMeetingRsvp({ weekKey }: Props) {
  const [intentionState, intentionAction, intentionPending] = useActionState(
    submitIntention,
    initialFormState,
  );

  return (
    <form
      action={intentionAction}
      className="space-y-4 rounded-xl border border-mkp-border bg-mkp-surface-subtle p-4 shadow-sm ring-1 ring-mkp-navy/5"
    >
      <input type="hidden" name="weekKey" value={weekKey} />
      <p className="text-xs font-semibold uppercase tracking-wide text-mkp-muted">
        This week&apos;s circle
      </p>
      <div>
        <label
          htmlFor="home-intention-name"
          className="block text-sm font-medium text-mkp-ink"
        >
          Your name
        </label>
        <input
          id="home-intention-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={80}
          className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface px-3 py-2 text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
          placeholder="First name or how you go in circle"
        />
      </div>
      <div>
        <p
          className="text-sm font-medium text-mkp-ink"
          id="home-intention-status-label"
        >
          Planning to attend?
        </p>
        <div
          className="mt-3 grid gap-3 sm:grid-cols-2"
          role="group"
          aria-labelledby="home-intention-status-label"
        >
          <button
            type="submit"
            name="status"
            value="yes"
            disabled={intentionPending}
            className={`${yesNoBtn} border-mkp-border bg-mkp-surface text-mkp-ink shadow-sm hover:border-green-500/70 hover:bg-green-50/50`}
          >
            Yes
          </button>
          <button
            type="submit"
            name="status"
            value="no"
            disabled={intentionPending}
            className={`${yesNoBtn} border-mkp-border bg-mkp-surface text-mkp-ink shadow-sm hover:border-red-500/70 hover:bg-red-50/50`}
          >
            No
          </button>
        </div>
        {intentionPending ? (
          <p className="mt-2 text-sm text-mkp-muted" aria-live="polite">
            Saving…
          </p>
        ) : null}
      </div>
      <Message state={intentionState} />
    </form>
  );
}
