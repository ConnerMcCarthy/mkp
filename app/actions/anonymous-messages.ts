"use server";

import { revalidatePath } from "next/cache";
import { MAX_ANONYMOUS_BODY_LENGTH } from "@/lib/anonymous-messages-constants";
import {
  addAnonymousMessage,
  addAnonymousPoll,
  incrementMessageLike,
  incrementPollVote,
  type PollOption,
} from "@/lib/anonymous-messages-store";

export type SubmitMessageState =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function submitAnonymousMessage(
  _prev: SubmitMessageState | undefined,
  formData: FormData,
): Promise<SubmitMessageState> {
  const body = String(formData.get("body") ?? "");
  const trimmed = body.trim();
  if (!trimmed) {
    return { ok: false, error: "Write something before sending." };
  }
  if (trimmed.length > MAX_ANONYMOUS_BODY_LENGTH) {
    return {
      ok: false,
      error: `Keep it under ${MAX_ANONYMOUS_BODY_LENGTH} characters (currently ${trimmed.length}).`,
    };
  }

  try {
    await addAnonymousMessage(body);
    revalidatePath("/messages");
    return {
      ok: true,
      message: "Posted. Everyone can see it on this page.",
    };
  } catch {
    return { ok: false, error: "Could not save your message. Try again later." };
  }
}

export async function submitAnonymousPoll(
  _prev: SubmitMessageState | undefined,
  formData: FormData,
): Promise<SubmitMessageState> {
  const question = String(formData.get("pollQuestion") ?? "");
  const optionRows = formData
    .getAll("option")
    .map((v) => String(v ?? ""));

  const trimmedQ = question.trim();
  if (!trimmedQ) {
    return { ok: false, error: "Enter a poll question." };
  }

  try {
    await addAnonymousPoll(trimmedQ, optionRows);
    revalidatePath("/messages");
    return {
      ok: true,
      message: "Poll posted. Everyone can vote on this page.",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("two distinct")) {
      return {
        ok: false,
        error: "Add at least two different options (fill two or more option lines).",
      };
    }
    return { ok: false, error: "Could not save the poll. Try again later." };
  }
}

export type VotePollState =
  | { ok: true; options: PollOption[] }
  | { ok: false; error: string };

export async function votePollOption(
  _prev: VotePollState | undefined,
  formData: FormData,
): Promise<VotePollState> {
  const messageId = String(formData.get("messageId") ?? "").trim();
  const optionId = String(formData.get("optionId") ?? "").trim();
  if (!messageId || !optionId) {
    return { ok: false, error: "Missing poll or option." };
  }

  try {
    const options = await incrementPollVote(messageId, optionId);
    revalidatePath("/messages");
    return { ok: true, options };
  } catch {
    return { ok: false, error: "Couldn’t record your vote. Try again." };
  }
}

export type LikeMessageState =
  | { ok: true; likes: number }
  | { ok: false; error: string };

export async function likeAnonymousMessage(
  _prev: LikeMessageState | undefined,
  formData: FormData,
): Promise<LikeMessageState> {
  const messageId = String(formData.get("messageId") ?? "").trim();
  if (!messageId) {
    return { ok: false, error: "Missing message." };
  }

  try {
    const likes = await incrementMessageLike(messageId);
    revalidatePath("/messages");
    return { ok: true, likes };
  } catch {
    return { ok: false, error: "Couldn’t update likes. Try again." };
  }
}
