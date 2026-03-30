"use client";

import { useActionState } from "react";
import {
  likeAnonymousMessage,
  type LikeMessageState,
} from "@/app/actions/anonymous-messages";

type Props = {
  messageId: string;
  likeCount: number;
};

export function MessageLikeButton({ messageId, likeCount }: Props) {
  const [state, formAction, pending] = useActionState(
    likeAnonymousMessage,
    undefined as LikeMessageState | undefined,
  );

  const likes = state?.ok === true ? state.likes : likeCount;
  const label = likes === 1 ? "1 like" : `${likes} likes`;

  return (
    <form action={formAction} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="messageId" value={messageId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-mkp-border bg-mkp-surface px-2.5 py-1 text-xs font-medium text-mkp-ink transition-colors hover:border-mkp-blue hover:text-mkp-blue disabled:pointer-events-none disabled:opacity-60"
        aria-label={`Like this message — ${label} so far`}
      >
        <span>Like</span>
        <span className="tabular-nums text-mkp-muted">{likes}</span>
      </button>
      {state?.ok === false ? (
        <span className="max-w-[12rem] text-right text-[11px] text-red-700">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
