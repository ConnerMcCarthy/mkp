"use client";

import { useActionState } from "react";
import {
  votePollOption,
  type VotePollState,
} from "@/app/actions/anonymous-messages";
import type {
  AnonymousPollMessage,
  PollOption,
} from "@/lib/anonymous-messages-store";

type Props = {
  message: AnonymousPollMessage;
};

export function PollBoardCard({ message }: Props) {
  const [state, voteAction, pending] = useActionState(
    votePollOption,
    undefined as VotePollState | undefined,
  );

  const options: PollOption[] =
    state?.ok === true ? state.options : message.options;
  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="mt-2 space-y-3">
      <p className="text-sm font-medium text-mkp-ink">{message.question}</p>
      <ul className="space-y-3">
        {options.map((opt) => {
          const pct =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <li key={opt.id} className="rounded-lg border border-mkp-border/80 bg-mkp-surface p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 flex-1 text-sm text-mkp-ink">
                  {opt.label}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="tabular-nums text-xs text-mkp-muted">
                    {opt.votes}
                    {totalVotes > 0 ? ` · ${pct}%` : ""}
                  </span>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      const fd = new FormData();
                      fd.set("messageId", message.id);
                      fd.set("optionId", opt.id);
                      voteAction(fd);
                    }}
                    className="rounded-lg border border-mkp-border bg-mkp-surface px-2.5 py-1 text-xs font-medium text-mkp-ink transition-colors hover:border-mkp-blue hover:text-mkp-blue disabled:pointer-events-none disabled:opacity-60"
                  >
                    Vote
                  </button>
                </div>
              </div>
              {totalVotes > 0 ? (
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-mkp-border"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-mkp-blue transition-[width]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {state?.ok === false ? (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
